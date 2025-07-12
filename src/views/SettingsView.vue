<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <button class="btn btn-light" @click="router.replace('/')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <h5 class="mx-auto">Settings</h5>
      <button class="btn btn-light invisible" @click="router.push('/settings')">
        <i class="bi bi-gear"></i>
      </button>
    </div>
  </nav>

  <div class="container mt-5 pt-5">
    <div class="row mb-3">
      <label for="maxRelayLvlInput" class="col-4 col-form-label">Relay level</label>
      <div class="col-8">
        <select class="form-select" v-model="maxRelayLvl" @change="saveRelayLevel" id="maxRelayLvlInput">
          <option v-for="n in 11" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <label for="starterPackInput" class="col-4 col-check-label">Starter pack</label>
      <div class="col-8">
        <input class="form-check-input" type="checkbox" v-model="starterPack" @change="saveStarterPack" id="starterPackInput">
      </div>
    </div>
    <div class="row mb-3">
      <label for="displayType" class="col-4 col-check-label">Display as map</label>
      <div class="col-8">
        <input class="form-check-input" type="checkbox" v-model="displayAsMap" @change="saveDisplayAsMap" id="displayType">
      </div>
    </div>
    <hr />
    <div class="row mb-3">
      <label for="displayType" class="col-4 col-check-label">Data</label>
      <div class="col-8">
        <button type="button" class="btn btn-light" @click="downloadCSV">Télécharger CSV</button>
      </div>
    </div>
    <hr />
    <div class="my-4">
      <h6>Planetes :</h6>
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-start" v-for="item in planeteList" :key="item.type">
          <span class="badge text-bg-secondary rounded-pill" style="margin-top:auto;margin-bottom:auto;">{{ item.lvl }}</span>
          <div class="ms-2 me-auto">
            <div class="fw-bold">{{ item.nom ? item.nom : i18n[item.type] }}</div>
            <i class="bi bi-crosshair"></i> {{ item.coord }}
          </div>
          <button class="btn btn-light"  @click="router.push('/edit/' + item.type)">
            <i class="bi bi-pencil"></i>
          </button>
        </li>
      </ul>
      <hr />
      <h6>Trade stations :</h6>
      <ul class="list-group" >
        <li class="list-group-item d-flex justify-content-between align-items-start" v-for="item in stationList" :key="item.type">
          <span class="badge text-bg-secondary rounded-pill" style="margin-top:auto;margin-bottom:auto;">{{ item.lvl }}</span>
          <div class="ms-2 me-auto">
            <div class="fw-bold">{{ item.nom ? item.nom : i18n[item.type] }}</div>
            <i class="bi bi-crosshair"></i> {{ item.coord }}
          </div>
          <button class="btn btn-light" @click="router.push('/edit/' + item.type)">
            <i class="bi bi-pencil"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>

</template>

<script setup>
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { getPlaneteOrder } from '@/utils/optimization';
import { i18n } from '@/utils/data';
import { computed } from 'vue';

const router = useRouter();

const personalData = JSON.parse(localStorage.getItem('personalData'));

const maxRelayLvl = personalData.maxRelayLvl;
const starterPack = personalData.starterPack;
const displayAsMap = personalData.displayAsMap;

const planeteList = computed(() => {
  return personalData.planetes?.map((item) => {
    return {
      ...item,
      order: getPlaneteOrder(item.type),
    };
  }).sort((a, b) => a.order - b.order);
});

const stationList = computed(() => {
  return personalData.stations?.map((item) => {
    return {
      ...item,
      order: item.type.substring(2),
    };
  }).sort((a, b) => a.order - b.order);
});

const saveRelayLevel = (event) => {
  personalData.maxRelayLvl = event.target.value;
  localStorage.setItem('personalData', JSON.stringify(personalData));
};

const saveStarterPack = (event) => {
  personalData.starterPack = event.target.checked;
  localStorage.setItem('personalData', JSON.stringify(personalData));
};

const saveDisplayAsMap = (event) => {
  personalData.displayAsMap = event.target.checked;
  localStorage.setItem('personalData', JSON.stringify(personalData));
};

const downloadCSV = () => {
  // Convertir en CSV
  const headers = Object.keys(planeteList.value[0]);
  const csvRows = [
    headers.join(';'), // ligne d'en-tête
    ...planeteList.value.map(row => headers.map(field => `"${row[field]}"`).join(';'))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Créer un lien de téléchargement
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>