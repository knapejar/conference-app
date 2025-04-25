<template>
    <ion-item button @click="navigateToDetail">
        <ion-icon 
            :name="isStarred ? 'star' : 'star-outline'" 
            slot="start" 
            @click.stop="toggleStar" 
            class="star-icon"
        />
        <ion-button v-if="presentation.questionsRoom" slot="end" :router-link="'/questions/' + presentation.id" size="large" @click.stop>
            <ion-icon name="chatbubbles-outline"></ion-icon>
        </ion-button>
        <ion-label>
            <h2>{{ presentation.title }}</h2>
            <div class="presenters">
                <ion-avatar v-for="presenter in displayedPresenters" :key="presenter.id" class="presenter-avatar">
                    <img :src="presenter.imageURL" :alt="presenter.name" />
                </ion-avatar>
                <span v-if="hasMorePresenters" class="more-presenters">({{ presentation.presenters.length }})</span>
            </div>
            <p>Začátek: {{ new Date(presentation.start).toLocaleTimeString() }}</p>
            <p>Konec: {{ new Date(presentation.end).toLocaleTimeString() }}</p>
        </ion-label>
    </ion-item>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import QuestionsIconButton from '../questions/QuestionsIconButton.vue';

export default {
    components: {
        QuestionsIconButton
    },
    props: {
        presentation: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore();
        const router = useRouter();
        
        const isStarred = computed(() => {
            return store.getters['presentations/isPresentationStarred'](props.presentation.id);
        });

        const displayedPresenters = computed(() => {
            return props.presentation.presenters.slice(0, 5);
        });

        const hasMorePresenters = computed(() => {
            return props.presentation.presenters.length > 5;
        });
        
        const toggleStar = () => {
            store.dispatch('presentations/toggleStar', props.presentation.id);
        };

        const navigateToDetail = () => {
            router.push(`/presentations/${props.presentation.id}`);
        };
        
        return {
            isStarred,
            toggleStar,
            navigateToDetail,
            displayedPresenters,
            hasMorePresenters
        };
    }
}
</script>

<style scoped>
.star-icon {
    cursor: pointer;
    font-size: 1.2em;
}

.presenters {
    display: flex;
    gap: 8px;
    margin: 8px 0;
    align-items: center;
}

.presenter-avatar {
    width: 24px;
    height: 24px;
}

.presenter-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.more-presenters {
    color: var(--ion-color-medium);
    font-size: 0.9em;
    margin-left: 4px;
}
</style>