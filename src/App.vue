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
          nom: "Albixmin",
          type: "desert_lv1",
          coord: "G5",
          lvl: 50,
        },
        {
          nom: "Alman",
          type: "terran_lv3",
          coord: "J2",
          lvl: 48,
        },
        {
          nom: "Angaville",
          type: "terran_lv1",
          coord: "F5",
          lvl: 45,
        },
        {
          nom: "Appleton",
          type: "ice_variation2",
          coord: "H8",
          lvl: 48,
        },
        {
          nom: "Aurevin",
          type: "gas_lv2",
          coord: "J5",
          lvl: 48,
        },
        {
          nom: "Axlia",
          type: "lava_lv3",
          coord: "E7",
          lvl: 46,
        },
        {
          nom: "Blanhis",
          type: "terran_lv2",
          coord: "I5",
          lvl: 45,
        },
        {
          nom: "Blave",
          type: "water_lv1",
          coord: "G6",
          lvl: 45,
        },
        {
          nom: "Cynara",
          type: "lava_lv1",
          coord: "G5",
          lvl: 46,
        },
        {
          nom: "Danilama",
          type: "water_lv3",
          coord: "E5",
          lvl: 46,
        },
        {
          nom: "Ecusuna",
          type: "desert_lv2",
          coord: "K5",
          lvl: 45,
        },
        {
          nom: "Emmand",
          type: "gas_lv1",
          coord: "I4",
          lvl: 45,
        },
        {
          nom: "Eve",
          type: "lava_lv2",
          coord: "J3",
          lvl: 45,
        },
        {
          nom: "Hepult",
          type: "desert_lv3",
          coord: "F4",
          lvl: 48,
        },
        {
          nom: "Julmar",
          type: "ice_variation1",
          coord: "G3",
          lvl: 48,
        },
        {
          nom: "Lellica",
          type: "water_lv2",
          coord: "I6",
          lvl: 45,
        },
      ],
      stations: [
        {
          nom: "Trade station 1",
          type: "TS1",
          coord: "J6",
          lvl: 10,
        },
        {
          nom: "Trade station 2",
          type: "TS2",
          coord: "G4",
          lvl: 10,
        },
        {
          nom: "Trade station 3",
          type: "TS3",
          coord: "F7",
          lvl: 10,
        }
      ]
    }));
  }
});

</script>