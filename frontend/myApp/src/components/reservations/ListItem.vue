<template>
  <ion-item
    v-if="reservation"
    button
    :routerLink="'/reservations/' + reservation.id"
    :detail="false"
    class="list-item"
  >
    <ion-icon :icon="clipboardOutline" slot="start" />
    <ion-label class="ion-text-wrap">
      <h3>{{ reservation.id }}</h3>
      <ul id="acc-info">
        <li>Customer: {{ reservation.customer }}</li>
        <li>From: {{ reservation.date_from.split("T")[0] }}</li>
        <li>To: {{ reservation.date_to.split("T")[0] }}</li>
        <li>Booked: {{ reservation.is_booked ? "Yes" : "No" }}</li>
      </ul>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { clipboardOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonIcon,
  },
  props: {
    reservation: Object,
  },
  setup() {
    return {
      clipboardOutline,
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