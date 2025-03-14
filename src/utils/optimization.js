import _ from 'lodash';
import solver from "javascript-lp-solver";
import { tradStations, planeteDef, levels, shipmentRelay } from './data';

const buildModel = (sectors, budget) => {
    let model = {
        optimize: "gain",
        opType: "max",
        constraints: { budget: { "max": budget } },
        variables: {},
        ints: {}
    };

    for (let sectorKey of Object.keys(sectors)) {
        console.log("sectorKey", sectorKey);
        let sector = sectors[sectorKey];

        sector.relays.forEach(relay => {
            let varName = `${sectorKey}_lvl${relay.lvl}`;
            
            // Assurer que la variable est binaire (0 ou 1)
            model.variables[varName] = {
                gain: relay.gain,
                budget: relay.cost,
                [sectorKey]: 1 // Assurer qu'un seul niveau est choisi
            };
            model.ints[varName] = 1;
            // Ajouter à la contrainte budget
            model.constraints.budget[varName] = relay.cost;
        });

        // Ajouter la contrainte pour garantir un seul niveau par secteur
        model.constraints[sectorKey] = { "equal": 1 };
    }
    return model;
};
const optimizeRelays = (sectors, budget) => {
    let model = {
        optimize: "gain",
        opType: "max",
        constraints: { budget: { "max": budget } },
        variables: {},
        ints: {}
    };

    for (let sectorKey of Object.keys(sectors)) {
        console.log("sectorKey", sectorKey);
        let sector = sectors[sectorKey];

        sector.relays.forEach(relay => {
            let varName = `${sectorKey}_lvl${relay.lvl}`;
            
            // Assurer que la variable est binaire (0 ou 1)
            model.variables[varName] = {
                gain: relay.gain,
                budget: relay.cost,
                [sectorKey]: 1 // Assurer qu'un seul niveau est choisi
            };
            model.ints[varName] = 1;
            // Ajouter à la contrainte budget
            model.constraints.budget[varName] = relay.cost;
        });

        // Ajouter la contrainte pour garantir un seul niveau par secteur
        model.constraints[sectorKey] = { "equal": 1 };
    }
    console.log("before solve", model);
    let solution = solver.Solve(model);

    console.log("solution", solution);
    
    if (!solution.feasible) {
        console.error("Aucune solution trouvée avec les contraintes données.");
        return null;
    }
    
    let selectedRelays = Object.keys(solution)
        .filter(key => key.includes("_lvl") && solution[key] === 1)
        .map(relay => {
            let [sector, lvl] = relay.split("_lvl");
            const level = parseInt(lvl, 10);
            const current = sectors[sector].relays.find(r => r.lvl == level);
            return { sector, lvl: level, nom : sectors[sector].nom, cost: current.cost, gain: current.gain };
        });

    return {
        totalGain: solution.result,
        selectedRelays: _.sortBy(selectedRelays, "lvl")
    };
};
const enrichPlanetes = (planetes, pack, maxRelayLvl) => _.chain(planetes).filter(p => p.lvl != 0).map((planete) => {
        if (_.startsWith(planete.type, "TS")) {
            return {
                ...planete,
                ...tradStations.find((def) => def.lvl === planete.lvl)
            }
        }
        return {
            ...planete,
            ...planeteDef.find((def) => def.Name === planete.type),
            ...levels.find((def) => def.lvl === planete.lvl),
        }
    })
    .map((planete) => {
        const items = planete.moon ? 1 + parseInt(planete.moon) : 1;
        const creditIncomModifier = planete.CreditIncomeModifier ?  planete.CreditIncomeModifier/ 100 : 1;
        return {
            nom: planete.nom,
            lvl: planete.lvl,
            type: planete.type,
            shipmentYield: (planete.TotalShipmentCRPerDay * creditIncomModifier * (pack ? 1.35 : 1)) * items,
            maxShipments: planete.MaxShipments * items,
            coord: planete.coord,
        }
    })
    .reduce((acc, planete) => ({...acc, [planete.coord]: {
        nom: (acc[planete.coord]?.nom ? acc[planete.coord]?.nom + " " : "")  + planete.nom,
        shipmentYield: planete.shipmentYield + (acc[planete.coord]?.shipmentYield || 0),
        maxShipments: planete.maxShipments + (acc[planete.coord]?.maxShipments || 0),
        coord: planete.coord,
    }}), {})
    .mapValues((planete) => {
        return {
          ...planete,
          relays: shipmentRelay.filter(relay => relay.lvl <= maxRelayLvl).map((relay) => {
            return {
              cost: relay.HydroCostPerShipment * planete.maxShipments,
              gain: planete.shipmentYield + (planete.shipmentYield * relay.RelayBonusPct) / 100,
              lvl: relay.lvl
            }
          })
        }
      }).value();

const buildGlpkModel = async (sectors, budget, glpk) => {
    const glpkModel = {
        name: "Optimization",
        objective: {
            direction: glpk.GLP_MAX,
            name: "gain",
            vars: []
        },
        subjectTo: [],
        binaries: [] // Contraintes binaires pour forcer 0 ou 1
    };

    let constraints = {
        budget: {
            name: "budget",
            vars: [],
            bnds: { type: glpk.GLP_UP, ub: budget, lb: 0 } // Contrainte budget max
        }
    };

    for (const sectorKey of Object.keys(sectors)) {
        const sector = sectors[sectorKey];
        const sectorConstraint = {
            name: sectorKey,
            vars: [],
            bnds: { type: glpk.GLP_FX, ub: 1, lb: 1 } // Un seul niveau choisi par secteur
        };

        sector.relays.forEach(relay => {
            const varName = `${sectorKey}_lvl${relay.lvl}`;

            // Ajouter cette variable à l'objectif
            glpkModel.objective.vars.push({ name: varName, coef: relay.gain });

            // Ajouter à la contrainte de budget
            constraints.budget.vars.push({ name: varName, coef: relay.cost });

            // Ajouter à la contrainte de sélection unique du secteur
            sectorConstraint.vars.push({ name: varName, coef: 1 });

            // Ajouter à la liste des variables binaires
            glpkModel.binaries.push(varName);
        });

        constraints[sectorKey] = sectorConstraint;
    }

    // Ajouter toutes les contraintes au modèle
    glpkModel.subjectTo = Object.values(constraints);
    return glpkModel;
};

const getPlaneteOrder = (type) => {
    return _.findLast(planeteDef, (def) => def.Name === type).id;
};

export {optimizeRelays, enrichPlanetes, getPlaneteOrder, buildModel, buildGlpkModel};