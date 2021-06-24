<template>
  <ion-item
    v-if="accomodation"
    button
    :routerLink="'/accomodations/' + accomodation.id"
    :detail="false"
    class="list-item"
  >
    <ion-icon :icon="getIcon(accomodation.type)" slot="start" />
    <ion-label class="ion-text-wrap">
      <h3>{{ accomodation.name }}</h3>
      <ul id="acc-info">
        <li>Area: {{ accomodation.area.toFixed(1) }} m²</li>
        <li>Daily Price: €{{ accomodation.daily_price.toFixed(2) }}</li>
        <li v-if="accomodation.season_price > 0">
          Season Price: €{{ accomodation.season_price.toFixed(2) }}
        </li>
        <li>Utilities: {{ accomodation.utilities?.length || 0 }}</li>
      </ul>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { diamondOutline, bonfireOutline, homeOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonIcon,
  },
  props: {
    accomodation: Object,
  },
  methods: {
    isIos: () => {
      return window && window.Ionic && window.Ionic.mode === "ios";
    },
    getIcon: (type) => {
      if (type === "C") return diamondOutline;
      if (type === "S") return homeOutline;
      else return bonfireOutline;
    },
  },
});
</script>

<style scoped>
#acc-info {
  display: inline;
  list-style: none;
  padding: 0;
  font-size: 12px;
  color: gray;
}

#acc-info li {
  display: inline;
}

#acc-info li:after {
  content: ", ";
}

#acc-info li:last-child:after {
  content: "";
}
</style>