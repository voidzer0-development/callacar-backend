<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Utilities</ion-title>
        <ion-buttons slot="primary">
          <ion-button button router-link="/utilities/create">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Utilities</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="!loading">
        <ListItem
          v-for="utility in searchedItems"
          :key="utility.id"
          :utility="utility"
        />
      </ion-list>
      <ion-list v-else>
        <ListLoadingItems />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
} from "@ionic/vue";

import ListLoadingItems from "@/components/ListLoadingItems.vue";
import ListItem from "@/components/utilities/ListItem.vue";
import { defineComponent } from "vue";
import { add } from "ionicons/icons";

import { UtilityService } from "@/services/utility.service";

export default defineComponent({
  name: "Utilities",
  data() {
    return {
      loading: true,
      utilities: null,
      search: null,
    };
  },
  computed: {
    searchedItems: function () {
      const utilities = this.utilities;
      const query = this.search;
      if (!query) return utilities;
      return utilities?.filter(
        (s) => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    },
  },
  async mounted() {
    const response = await UtilityService.getUtilities();
    this.utilities = response.data;
    this.loading = false;
  },
  methods: {
    refresh: async function (ev) {
      try {
        this.loading = true;

        const response = await UtilityService.getUtilities();
        this.utilities = response.data;

        this.loading = false;
        ev.target.complete();
      } catch (error) {
        ev.target.cancel();
      }
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    ListLoadingItems,
    ListItem,
  },
  setup() {
    return {
      add,
    };
  },
});
</script>