<template>
  <ion-item
    v-if="customer"
    button
    :routerLink="'/customers/' + customer.id"
    :detail="false"
    class="list-item"
  >
    <ion-icon :icon="personOutline" slot="start" />
    <ion-label class="ion-text-wrap">
      <h3>{{ customer.name }}</h3>
      <ul id="acc-info">
        <li>DOB: {{ customer.date_of_birth }}</li>
        <li>ID Card: {{ customer.has_id_card ? "Yes" : "No" }}</li>
        <li>Passport: {{ customer.has_passport ? "Yes" : "No" }}</li>
        <li>Created By: {{ customer.created_by }}</li>
      </ul>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { personOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonIcon,
  },
  props: {
    customer: Object,
  },
  setup() {
    return {
      personOutline,
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