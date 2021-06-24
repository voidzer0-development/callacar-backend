<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Accomodations</ion-title>
        <ion-buttons slot="primary" v-show="is_admin">
          <ion-button button router-link="/accomodations/create">
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
          <ion-title size="large">Accomodations</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="!loading">
        <ListItem
          v-for="accomodation in searchedItems"
          :key="accomodation.id"
          :accomodation="accomodation"
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
import ListItem from "@/components/accomodations/ListItem.vue";
import { defineComponent } from "vue";
import { add } from "ionicons/icons";

import { AuthService } from "@/services/auth.service";
import { AccomodationService } from "@/services/accomodation.service";

export default defineComponent({
  name: "Accomodations",
  data() {
    return {
      is_admin: false,
      loading: true,
      accomodations: null,
      search: null,
    };
  },
  computed: {
    searchedItems: function () {
      const accomodations = this.accomodations;
      const query = this.search;
      if (!query) return accomodations;
      return accomodations?.filter(
        (s) => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    },
  },
  async mounted() {
    // Checks access to the "+" button in the toolbar.
    try {
      const user = await AuthService.getUser();
      this.is_admin = user.is_admin;
    } catch (error) {
      this.is_admin = false;
    }

    // Actually retrieves the data.
    const response = await AccomodationService.getAccomodations();
    this.accomodations = response.data;

    this.loading = false;
  },
  methods: {
    refresh: async function (ev) {
      try {
        this.loading = true;

        const response = await AccomodationService.getAccomodations();
        this.accomodations = response.data;

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