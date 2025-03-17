<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <button class="btn btn-light" @click="router.back()">
        <i class="bi bi-arrow-left"></i>
      </button>
      <h5 class="mx-auto">{{ type }}</h5>
      <button class="btn btn-light invisible" @click="router.push('/settings')">
        <i class="bi bi-gear"></i>
      </button>
    </div>
  </nav>

  <div class="container mt-5 pt-5">
    <div class="row mb-3">
      <label for="Nom" class="col-4 col-form-label">Nom</label>
      <div class="col-8">
        <input v-model="nom" class="form-control" type="text" id="Nom">
      </div>
    </div>
    <div class="row mb-3">
      <label for="lvl" class="col-4 col-form-label">Level</label>
      <div class="col-8">
        <input v-model="lvl" class="form-control" type="number" min="0" :max="type ? 64 : 10" id="lvl">
      </div>
    </div>
    <div class="row mb-3">
      <label for="sector" class="col-4 col-form-label">Sector</label>
      <div class="col-8">
        <input v-model="coord" class="form-control" type="text" id="sector">
      </div>
    </div>
    <div class="row mb-3">
      <button @click="save" type="button" class="btn btn-primary mt-2" >Save</button>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import _ from 'lodash';
import { i18n } from '@/utils/data';

const router = useRouter();
const route = useRoute();
const personalData = JSON.parse(localStorage.getItem('personalData'));
const item = _.find([...personalData.planetes, ...personalData.stations], { type: route.params.id });

const type = i18n[item.type];
const nom = ref(item.nom);
const lvl = ref(item.lvl);
const coord = ref(item.coord);

const save = () => {
  const index = _.findIndex(personalData.planetes, { type: route.params.id });
  if (index !== -1) {
    personalData.planetes[index] = { ...personalData.planetes[index], nom: nom.value, lvl: lvl.value, coord: coord.value };
  } else {
    const index = _.findIndex(personalData.stations, { type: route.params.id });
    personalData.stations[index] = { ...personalData.stations[index], nom: nom.value, lvl: lvl.value, coord: coord.value };
  }
  localStorage.setItem('personalData', JSON.stringify(personalData));
  router.back();
}

</script>