<template>
  <ion-item
    v-if="site"
    button
    :routerLink="'/sites/' + site.id"
    :detail="false"
    class="list-item"
  >
    <ion-icon :icon="locationOutline" slot="start" />
    <ion-label class="ion-text-wrap">
      <h3>{{ site.name }}</h3>
      <ul id="acc-info">
        <li>Accomodation: {{ site.accomodation }}</li>
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
    site: Object,
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