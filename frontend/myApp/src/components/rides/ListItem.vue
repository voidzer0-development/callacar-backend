<template>
  <ion-item
    v-if="ride"
    button
    :routerLink="'/ride/' + ride._id"
    :detail="false"
    class="list-item"
  >
    <ion-icon :icon="locationOutline" slot="start" />
    <ion-label class="ion-text-wrap">
      <h3>{{ ride.endPoint }}</h3>
      <ul id="acc-info">
        <li>Startpoint: {{ ride.startPoint }}</li>
        <li>endPoint: {{ ride.endPoint }}</li>
        <li>car: {{ride.car}}</li>
      </ul>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { locationOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonIcon,
  },
  props: {
    ride: Object,
  },
  setup() {
    return {
      locationOutline,
    };
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