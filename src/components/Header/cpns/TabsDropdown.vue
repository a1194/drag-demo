<script setup>
import { getPath } from "@/utils";
import { computed, onMounted, onUnmounted, ref } from "vue"
const props =  defineProps({
    data: Array
})
const emits = defineEmits(["change"])
const selected = computed(() => {
    return props.data[currentIndex.value]?.name
})

const isShow = ref(false)
function handleSelectedClick() {
    isShow.value = !isShow.value
}

const currentIndex = ref(0)
function handleItemClick(item, index) {
    currentIndex.value = index
    isShow.value = !isShow.value
    emits("change", item)
}


function clickEvent() {
    isShow.value = false
}
onMounted(() => {
    document.body.addEventListener("click", clickEvent, false)
})
onUnmounted(() => {
    document.body.removeEventListener("click", clickEvent, false)
})
</script>

<template>
    <div class="dropdown" @click.stop>
        <div class="selected" @click="handleSelectedClick">
            <div class="name">{{ selected }}</div>
            <div class="arrow">
                <img :src="getPath() + 'chs_area_select_down_icon.png'" alt="" srcset="">
            </div>
        </div>
        <div class="down" :style="{display: isShow ? 'block' : 'none'}" >
            <template v-for="(item, index) in data" :key="index">
                <div class="box" :style="{backgroundColor: index == currentIndex ? 'rgb(236, 172, 53)' : ''}">
                    <div class="item" 
                        :style="{borderBottom: index == (data.length - 1) ? 'none' : '1px solid #ccc'}" 
                        @click="handleItemClick(item, index)"
                    >{{ item.name }}</div>
                </div>
                
            </template>
            <div class="downArrow"></div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .dropdown {
        position: relative;
        font-size: 32px;
        .selected {
            display: flex;
            align-items: center;
            .name {
                margin-right: 8px;
            }
            .arrow {
                width: 30px;
                height: 30px;
            }
        }
        .down {
            position: absolute;
            z-index: 99;
            top: 60px;
            left: 0;
            background-color: #777;
            border-radius: 5px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            overflow: hidden;
            width: 200px;
            // color: rgb(236, 172, 53);
            .box {
                padding: 0 12px;

                .item {
                    padding: 12px 0px;
                }
            }
            .downArrow {
                position: absolute;
                top: -17px;
                left: 10px;
                border: 8px solid transparent;
                border-bottom-color: #777;
            }
        }
    }
</style>