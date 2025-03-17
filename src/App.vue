<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
  if (!localStorage.getItem('personalData')) {
    // Si c'est la première fois, on peupler avec des valeurs par défaut
    localStorage.setItem('personalData', JSON.stringify({
      maxRelayLvl: 1,
      starterPack: false,
      planetes: [
        {
          nom: "",
          type: "desert_lv1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "terran_lv3",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "terran_lv1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "ice_variation2",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "gas_lv2",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "lava_lv3",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "terran_lv2",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "water_lv1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "lava_lv1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "water_lv3",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "desert_lv2",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "gas_lv1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "lava_lv2",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "desert_lv3",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "ice_variation1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "water_lv2",
          coord: "",
          lvl: 0,
        },
      ],
      stations: [
        {
          nom: "",
          type: "TS1",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "TS2",
          coord: "",
          lvl: 0,
        },
        {
          nom: "",
          type: "TS3",
          coord: "",
          lvl: 0,
        }
      ]
    }));
  }
});

</script>