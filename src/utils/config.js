var DEV_TYPE = {
    UNKNOWN: 0,
    GATEWAY: 1,
    SWITCH_LIGHT: 2,
    DIM_LIGHT: 3,
    COLOR_TEMPERATURE_LIGHT: 4,
    CURTAIN: 5,
    AIR: 6,
    NEW_WIND: 7,
    FLOOR_HEATING: 8,
    SWITCH_PANEL: 9,
    SCENE_PANEL: 10,
    MUSIC: 11,
    ENVIRONMENTAL_DETECTOR: 12,
    SWITCH_MODULE: 13,
    HUMAN_INFRARED_DETECTOR: 14,
    WINDOW_MAGNETISM: 15,
    HANES_MASTER: 16,
    HANES_SLAVE: 17,
    EXHAUST_FAN: 18,
    SCENE_SWITCH: 19
};


export function getDevTypeText(dev_type) {
    switch (dev_type) {
        case DEV_TYPE.GATEWAY:
            return "网关";
        case DEV_TYPE.SWITCH_LIGHT:
            return "开关灯";
        case DEV_TYPE.DIM_LIGHT:
            return "调光灯";
        case DEV_TYPE.COLOR_TEMPERATURE_LIGHT:
            return "色温灯";
        case DEV_TYPE.CURTAIN:
            return "窗帘";
        case DEV_TYPE.AIR:
            return "空调";
        case DEV_TYPE.NEW_WIND:
            return "新风";
        case DEV_TYPE.FLOOR_HEATING:
            return "地暖";
        case DEV_TYPE.SWITCH_PANEL:
            return "开关面板";
        case DEV_TYPE.SCENE_PANEL:
            return "场景面板";
        case DEV_TYPE.MUSIC:
            return "音乐";
        case DEV_TYPE.ENVIRONMENTAL_DETECTOR:
            return "环境探测器";
        case DEV_TYPE.SWITCH_MODULE:
            return "开关模块";
        case DEV_TYPE.HUMAN_INFRARED_DETECTOR:
            return "人体探测器";
        case DEV_TYPE.WINDOW_MAGNETISM:
            return "窗磁";
        case DEV_TYPE.HANES_MASTER:
            return "恒适主机";
        case DEV_TYPE.HANES_SLAVE:
            return "恒适分机";
        case DEV_TYPE.EXHAUST_FAN:
            return "排风扇";
        case DEV_TYPE.SCENE_SWITCH:
            return "场景开关";
        default:
            return "未知设备";
    }
}