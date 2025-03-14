import initGLPK from "glpk.js";
import { buildGlpkModel } from '../utils/optimization';

self.onmessage = async (event) => {
    const { enrichedPlanetes, budget } = event.data;

    const glpk = await initGLPK();
    const model = await buildGlpkModel(enrichedPlanetes, budget, glpk);

    try {

        console.time("GLPK Solve Time");
        const solution = await glpk.solve(model);
        console.timeEnd("GLPK Solve Time");

        self.postMessage({ success: true, solution });
    } catch (error) {
        console.error("Worker: Error solving model", error);
        self.postMessage({ success: false, error: error.message });
    }
};