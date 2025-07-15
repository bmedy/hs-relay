<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <button class="btn btn-light invisible" @click="router.replace('/')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <h5 class="mx-auto">Home</h5>
      <button class="btn btn-light" @click="router.push('/settings')">
        <i class="bi bi-gear"></i>
      </button>
    </div>
  </nav>
  <div class="container mt-5 pt-5">
    <div class="my-4">
      <label>Budget :</label>
      <input v-model="budget" type="number" class="form-control" placeholder="Entrez le budget" />
      <button @click="runOptimization" type="button" class="btn btn-primary mt-2" :disabled="loading">{{ loading ? "Optimisation en cours..." : "Lancer l'optimisation" }}</button>
    </div>
    <div class="my-4" v-if="results">
      <p>Gain total optimisé : <strong>{{ results.totalGain }}</strong></p>
      <div v-if="!personalData.displayAsMap">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-start" v-for="item in results.selectedRelays" :key="item.sector">
            <strong>({{ item.sector }}) {{ item.nom }}</strong> <strong>{{ item.lvl }}</strong>
          </li>
        </ul>
      </div>
      <div v-if="personalData.displayAsMap">
        <HexGrid :selected-relays="results.selectedRelays" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import _ from 'lodash';
import { enrichPlanetes } from '@/utils/optimization';
import { useRouter } from 'vue-router';
import HexGrid from '@/components/HexGrid.vue';

const loading = ref(false);

const router = useRouter();

const budget = ref(0);
const results = ref(null);

const personalData = JSON.parse(localStorage.getItem('personalData'));

const defaultBudget = personalData.budget;
if (budget.value === 0) {
  budget.value = defaultBudget;
}

const runOptimization = async () => {
  loading.value = true;
  results.value = null;
  
  const enrichedPlanetes = enrichPlanetes([...personalData.planetes, ...personalData.stations], personalData.starterPack, personalData.maxRelayLvl);

  const worker = new Worker(new URL('@/workers/solverWorker.js', import.meta.url), { type: 'module' });

  worker.postMessage({ enrichedPlanetes, budget: budget.value });

  worker.onmessage = (event) => {
    const { solution } = event.data;
    if (event.data.success) {
      const selectedRelays = Object.keys(solution.result.vars)
          .filter(key => key.includes("_lvl") && solution.result.vars[key] === 1)
          .map(relay => {
              const [sector, lvl] = relay.split("_lvl");
              const level = parseInt(lvl, 10);
              const current = enrichedPlanetes[sector].relays.find(r => r.lvl == level);
              return { sector, lvl: level, nom : enrichedPlanetes[sector].nom, cost: current.cost, gain: current.gain };
          });

      results.value = {    
        totalGain: solution.result.z,
        selectedRelays: _.orderBy(selectedRelays, "lvl", "desc")
      };
    } else {
      console.error("Erreur lors de l'optimisation : " + event.data.error);
    }
    loading.value = false;
    worker.terminate();
  };

  localStorage.setItem('personalData', JSON.stringify({...personalData, budget: budget.value}));

};
</script>