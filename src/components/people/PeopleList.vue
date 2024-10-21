<template>
  <ion-content>
    <ion-list>
      <PeopleListItem 
        v-for="person in people" 
        :key="person.name" 
        :person="person" 
        @openModal="openModal(person)" />
    </ion-list>

    <!-- Modal Component -->
    <PersonModal 
      v-if="selectedPerson"
      :person="selectedPerson"
      :visible="isModalVisible"
      @close="closeModal" />
  </ion-content>
</template>

<script>
import PeopleListItem from './PeopleListItem.vue'; // Import the child component

export default {
  name: 'PeopleList',
  components: {
    PeopleListItem
  },
  props: {
    people: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedPerson: null,
      isModalVisible: false
    };
  },
  methods: {
    openModal(person) {
      this.selectedPerson = person;
      this.isModalVisible = true;
    },
    closeModal() {
      this.selectedPerson = null;
      this.isModalVisible = false;
    }
  }
};
</script>

<style scoped>
/* No custom styles needed */
</style>
