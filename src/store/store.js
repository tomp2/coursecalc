import Vue from "vue";
import Vuex from "vuex";
import { version } from "../../package.json";
import presetsData from "../../public/presetsData";

Vue.use(Vuex);

let createId = function () {
    return "_" + Math.random().toString(36).substr(2, 9);
};

const state = {
    version: "",
    keyp: undefined,
    open: {
        trayData: {},
        courses: {},
        blockSelections: {},
    },
    saved: {},
    hue_shift: 0,
};

const getters = {
    open: (state) => {
        return state.open;
    },
    courses: (state) => {
        return state.open.courses;
    },
    courseData: (state) => {
        return state.open.courses;
    },
    blockData: (state) => {
        return state.open.blockSelections;
    },
    saved: (state) => {
        return state.saved;
    },
};

const actions = {
    /*==============================================================
        Trays
    ==============================================================*/
    submitPreset({ commit }, presetName) {
        let preset = presetsData[presetName];
        commit("setTray", preset);
    },
    loadSavedTray({ getters, commit }, id) {
        let save = JSON.parse(JSON.stringify(getters.saved[id]));
        commit("setTray", save);
    },

    saveTrayByName({ commit }, name) {
        commit("saveTrayByName", name);
    },
    delSaveById({ commit }, id) {
        commit("delSaveById", id);
    },

    /*==============================================================
        Courses
    ==============================================================*/
    placeCourseSelection({ commit }, payload) {
        let {
            strParentBlockID,
            shortName,
            strCourseID,
            selectionStatus,
            courseSelected,
        } = payload;
        switch (selectionStatus) {
            case "c_available":
                commit("setCourseSelectionStatus", { shortName, value: true });
                commit("addSelectionToBlock", {
                    strParentBlockID,
                    strCourseID,
                });
                break;
            case "c_inactive--unavailable":
                if (!courseSelected) {
                    commit("setCourseSelectionStatus", {
                        shortName,
                        value: true,
                    });
                    commit("addSelectionToBlock", {
                        strParentBlockID,
                        strCourseID,
                    });
                }
                break;
            case "c_selected":
                commit("setCourseSelectionStatus", { shortName, value: false });
                commit("rmSelectionFromBlock", {
                    strParentBlockID,
                    strCourseID,
                });
                break;
            case "c_forced":
                commit("setCourseSelectionStatus", { shortName, value: false });
                commit("rmSelectionFromBlock", {
                    strParentBlockID,
                    strCourseID,
                });
                break;
        }
    },
    setCourseVisibility({ commit }, payload) {
        commit("setCourseVisibility", payload);
    },
    setCourseVisibilityAll({ commit }, value) {
        return new Promise((resolve) => {
            commit("setCourseVisibilityAll", { value });
            resolve();
        });
    },
};

const mutations = {
    /*==============================================================
        Trays
    ==============================================================*/
    setTray(state, payload) {
        state.keyp = Math.random().toString();
        state.open = payload;
    },

    saveTrayByName(state, name) {
        let id = createId();
        let saveData = JSON.parse(JSON.stringify(state.open));
        state.saved[id] = {
            id,
            name,
            trayData: saveData.trayData,
            courses: saveData.courses,
            blockSelections: saveData.blockSelections,
        };
    },
    delSaveById(state, id) {
        delete state.saved[id];
    },

    /*==============================================================
        Courses
    ==============================================================*/
    setCourseVisibility(state, payload) {
        let { shortName, value } = payload;
        state.open.courses[shortName].v = value;
    },
    setCourseVisibilityAll(state, payload) {
        let { value } = payload;

        let courses = Object.keys(state.open.courses);
        for (const course of courses) {
            if (!state.open.courses[course].s) {
                state.open.courses[course].v = value;
            }
        }
    },

    setCourseSelectionStatus(state, payload) {
        let { short, value } = payload;
        state.open.courses[short].s = value;
    },

    addSelectionToBlock(state, payload) {
        let { strParentBlockID, strCourseID } = payload;
        state.open.blockSelections[strParentBlockID].push(strCourseID);
    },
    rmSelectionFromBlock(state, payload) {
        let { strParentBlockID, strCourseID } = payload;
        state.open.blockSelections[strParentBlockID] =
            state.open.blockSelections[strParentBlockID].filter(
                (item) => item !== strCourseID
            );
    },

    initStore(state) {
        state.keyp = Math.random().toString();
        let localVuexStore = JSON.parse(localStorage.getItem("vuex_store"));
        if (localVuexStore && localVuexStore.version === version) {
            this.replaceState(Object.assign(state, localVuexStore));
        } else {
            state.version = version;
        }
    },
};

export default new Vuex.Store({
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
});
