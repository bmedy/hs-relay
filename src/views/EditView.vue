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
        <select class="form-select" v-model="coord" id="sector">
          <option v-for="n in sectors" :key="n" :value="n">{{ n }}</option>
        </select>
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

const sectors = ["E-8","E-7","E-6","E-5","F-8","F-7","F-6","F-5","F-4","G-8","G-7","G-6","G-5","G-4","G-3","H-8","H-7","H-6","H-5","H-4","H-3","H-2","I-7","I-6","I-5","I-4","I-3","I-2","J-6","J-5","J-4","J-3","J-2","K-5","K-4","K-3","K-2"];

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