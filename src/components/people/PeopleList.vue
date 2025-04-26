<template>
  <div>
    <ion-list>
      <PeopleListItem 
        v-for="person in people" 
        :key="person.id" 
        :person="person" 
        @openModal="openPersonDetail(person)" />
    </ion-list>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';

interface Person {
    id: string;
    name: string;
    role: string;
    details: string;
    imageURL: string;
}

export default {
  name: 'PeopleList',
  props: {
    people: {
      type: Array as () => Person[],
      required: true
    }
  },
  setup() {
    const router = useRouter();

    const openPersonDetail = (person: Person) => {
      router.push({ name: 'PersonDetail', params: { id: person.id } });
    };

    return {
      openPersonDetail
    };
  }
};
</script>