<script setup>
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import "@/assets/gridstack-reset.css"
import { GridStack } from 'gridstack';
import DevlistItem from "./DevlistItem.vue";
import { watch, onMounted, createApp, inject } from "vue"
import useMqttStore from '@/store/mqtt';

const mqttStore = useMqttStore()


let grid
onMounted(() => {
    grid = GridStack.init({
        float: true,
        column: 20,
        // oneColumnSize: 100
    });
    
    grid.on('added', function (event, items) {
        console.log(items);
        items.forEach(item => {
            const x = Number(item.x)
            const y = Number(item.y)
            const type = Number(item.id.split('_')[1])
            const id = Number(item.id.split('_')[2])
            console.log(x, y, type, id);
            const findItem = mqttStore.sortUi?.pages[0].favorites.find(item => (item.id == id) && (item.type == type))
            findItem.x = x
            findItem.y = y
            mqttStore.publish("editSortUi", mqttStore.sortUi)
        })
    })
    grid.on('dragstop', function (event, el) {
        const x = Number(el.getAttribute('gs-x'))
        const y = Number(el.getAttribute('gs-y'))
        const type = el.getAttribute('gs-id').split('_')[1]
        const id = el.getAttribute('gs-id').split('_')[2]
        console.log(id, type);
        const findItem = mqttStore.sortUi?.pages[0].favorites.find(item => (item.id == id) && (item.type == type))
        findItem.x = x
        findItem.y = y
        mqttStore.publish("editSortUi", mqttStore.sortUi)
    })
    grid.on('resizestop', function (event, el) {
        const w = Number(el.getAttribute('gs-w'))
        const h = Number(el.getAttribute('gs-h'))
        const type = el.getAttribute('gs-id').split('_')[1]
        const id = el.getAttribute('gs-id').split('_')[2]
        const findItem = mqttStore.sortUi?.pages[0].favorites.find(item => (item.id == id) && (item.type == type))
        findItem.w = w
        findItem.h = h
        mqttStore.publish("editSortUi", mqttStore.sortUi)
    })
    // const serializedData = [
    //     {x: 0, y: 0, w: 2, h: 2, content: '123'},
    //     // {x: 2, y: 3, w: 3, content: 'item 2'},
    //     // {x: 1, y: 3}
    // ];

    // grid.load(serializedData);
    // grid.column(16)

})
watch(() => mqttStore.favorites, (newFavorites) => {
    let { rooms, devices, combineScenes, sorts, favorites } = mqttStore

    const newFav = JSON.parse(JSON.stringify(favorites))
    newFav.forEach(item => {
        const id = `grid_${item.type}_${item.id}`
        item.content = `<div id='${id}'></div>`
        item.id = id
    })
    grid.load(newFav);

    
    // console.log(rooms, devices, combineScenes, sorts, favorites);
    let favList
    const allFavArr = []
    favorites.forEach((item, index) => {
        let findItem = {}
        if (item.type == 1) {
            findItem = devices.find(itemy => itemy.dev_id == item.id)
            if (findItem) {
                findItem.roomName = rooms.find(itemy => itemy.room_id == findItem.room_id)?.name
                findItem.dev_type = sorts.find(itemy => itemy.sort_id == findItem.sort_id)?.dev_type
                findItem.type = 1
                findItem.id = index
            }
        }
        if (item.type == 2) {
            findItem = combineScenes.find(itemy => itemy.scene_id == item.id)
            if (findItem) {
                findItem.roomName = '场景'
                findItem.type = 2
                findItem.id = index
            }
        }
        findItem.grid = item
        allFavArr.push(findItem)
    })
    favList = allFavArr
    // console.log(favList);

    const pos = {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: "hidden"
    }
    favList.forEach(item => {
        // console.log(item);

        createApp(DevlistItem, { data: item, type: item.type, isFav: true, dev_type: item.dev_type, pos }).mount(`#grid_${item.grid.type}_${item.grid.id}`)
    })
})
</script>

<template>
    <div class="asd">
        <div class="grid-stack"></div>
    </div>
</template>

<style lang="less" scoped>
:deep(.grid-stack-item-content) {
    // background-color: red;
}
</style>