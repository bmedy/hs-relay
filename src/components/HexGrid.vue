<template>
  <svg :width="gridWidth" :height="gridHeight" viewBox="-70 -35 700 700">
    <g v-for="(col, colIndex) in grid" :key="colIndex">
      <g v-for="(cell, rowIndex) in col" :key="rowIndex"
         :transform="getHexTransform(colIndex, rowIndex)">
        
        <!-- Hexagon Shape -->
        <polygon :points="hexPoints"
                 :fill="getCellInfos(cell).color"
                 stroke="#000" stroke-width="2" />
        
        <!-- Sector Label -->
        <text x="0" y="5" text-anchor="middle" fill="#FFF" font-size="16" font-weight="bold">
          {{ getCellInfos(cell).lvl }}
        </text>
      </g>
    </g>
  </svg>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

const {selectedRelays} = defineProps(['selectedRelays']);
console.log(selectedRelays);
const hexSize = 50;
const hexWidth = Math.sqrt(3) * hexSize;
const hexHeight = 2 * hexSize;
const spacing = 0; // Espacement entre les hexagones

// Données des secteurs organisées par colonnes exactes
const grid = ref(generateGrid());

function generateGrid() {
  return [
    ['E-8', 'E-7', 'E-6', 'E-5'],
    ['F-8', 'F-7', 'F-6', 'F-5', 'F-4'],
    ['G-8', 'G-7', 'G-6', 'G-5', 'G-4', 'G-3'],
    ['H-8', 'H-7', 'H-6', 'H-5', 'H-4', 'H-3', 'H-2'],
    ['I-7', 'I-6', 'I-5', 'I-4', 'I-3', 'I-2'],
    ['J-6', 'J-5', 'J-4', 'J-3', 'J-2'],
    ['K-5', 'K-4', 'K-3', 'K-2'],
  ].map((col, colIndex) => 
    col.map(name => ({ name, colIndex }))
  );
}

// Fonction pour récupérer la transformation d'un hexagone
function getHexTransform(col, row) {
  const x = col * (hexWidth + spacing);
  const y = row * (hexHeight + spacing) + (col % 2 !== 1 ? hexHeight * 0.5 : 0) + [(hexSize*2), (hexSize*2), 0, 0, 0, (hexSize*2), (hexSize*2)][col % 7];
  return `translate(${x},${y})`;
}

// Points du polygone pour un hexagone
const hexPoints = computed(() => {
  const angle = Math.PI / 3;
  return Array.from({ length: 6 }, (_, i) => {
    const x = hexSize * Math.cos(i * angle);
    const y = hexSize * Math.sin(i * angle);
    return `${x},${y}`;
  }).join(' ');
});

// Taille du SVG
const gridWidth = computed(() => grid.value.length * (hexWidth + spacing));
const gridHeight = computed(() => {
  const maxRows = Math.max(...grid.value.map(col => col.length));
  return maxRows * (hexHeight * 0.75 + spacing) + hexHeight;
});

const getCellInfos = (cell) => {
  const colors = {
  1: "#fcab8f",
  2: "#fc9b7c",
  3: "#fc8a6a",
  4: "#fb7a5a",
  5: "#fb694a",
  6: "#f6583e",
  7: "#f14432",
  8: "#e83429",
  9: "#d92523",
  10: "#ca181d",
  11: "#bc141a"
};
  const selectedRelay = selectedRelays.find(a => a.sector == cell.name);
  return { color : selectedRelay ? colors[selectedRelay.lvl] : '#c0c0c0', lvl: selectedRelay ? selectedRelay.lvl : cell.name };
};
</script>

<style scoped>
svg {
  display: block;
  margin: auto;
}
</style>
