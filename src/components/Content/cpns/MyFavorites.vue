<script setup>
import draggable from "vuedraggable";
import DevlistItem from "./DevlistItem.vue";
import useMqttStore from "@/store/mqtt";
import { ref, watch, toRefs } from "vue"


const mqttStore = useMqttStore()
const favList = ref([])



watch(() => mqttStore.favorites, (newFavorites) => {
    let { rooms, devices, combineScenes, sorts, favorites } = mqttStore
    // console.log(rooms, devices, combineScenes, sorts, favorites);
    const allFavArr = []
    favorites.forEach((item, index) => {
        let findItem = {}
        if (item.type == 1) {
            findItem = devices.find(itemy => itemy.dev_id == item.id)
            if(findItem) {
                findItem.roomName = rooms.find(itemy => itemy.room_id == findItem.room_id)?.name
                findItem.dev_type = sorts.find(itemy => itemy.sort_id == findItem.sort_id)?.dev_type
                findItem.type = 1
                findItem.id = index
            }
        }
        if (item.type == 2) {
            findItem = combineScenes.find(itemy => itemy.scene_id == item.id)
            if(findItem) {
                findItem.roomName = '场景'
                findItem.type = 2
                findItem.id = index
            }
        }
        findItem && allFavArr.push(findItem)
    })
    favList.value = allFavArr
    console.log(favList.value);
})

//拖拽开始的事件
const onStart = () => {
    console.log("开始拖拽");
};

//拖拽结束的事件
const onEnd = () => {
    const arr = []
    favList.value.forEach(item => {
        const obj = {
            type: item.type,
            id: item.dev_id || item.scene_id
        }
        arr.push(obj)
    })
    console.log(arr);
    mqttStore.sortUi.pages[0].favorites = arr
    mqttStore.publish("editSortUi", mqttStore.sortUi)
    // mqttStore.publish("getActiveSortUi", { sort_id: 1 })
};



</script>

<template>
    <draggable :list="favList" animation="300" @start="onStart" @end="onEnd" itemKey="id" delay="200" chosenClass="chosen"
        style="width: 100%;display: flex; flex-wrap: wrap;">
        <template #item="{ element }">
            <DevlistItem :data="element" class="item" :type="element.type" :isFav="true"
                :dev_type="element.dev_type"></DevlistItem>
        </template>
    </draggable>
    <!-- 123 -->
</template>

<style lang="less" scoped>
.item {
    width: 320px;
    margin-right: 30px;
    margin-bottom: 22px;
}
.chosen {
    opacity: .8;
}
</style>