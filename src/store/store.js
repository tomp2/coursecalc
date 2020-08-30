import Vue from 'vue'
import Vuex from 'vuex'
import { version } from '../../package.json'
import presetsData from '../assets/presetsData'

Vue.use(Vuex)

const MATCH_PERIOD_HEADER = RegExp('(.*lukio.*)', 'g')
const MATCH_BLOCK = RegExp('(?:\\n *)([A-ZÖÄ]{2,}.*)', 'g')
const MATCH_COURSE = RegExp(
  '([A-ZÖÄ]+[a-zöä]*(?:[A-ZÖÄ ])*\\d*[A-ZÖÄ]*(?:\\/I+)*)(?:[.](?:\\d{1,3}|[a-zöä]+\\d*|[A-ZÄÖ]+\\/[a-zöä]+|[A-ZÄÖ]\\d*|)(?:[ =]+[A-ZÖÄa-zöä]+[0-9]+)*(?:\\([^(]*\\))*(?: \\d\\d[A-ZÄ*])*(?: [a-zäö 0-9]+[A-Z])*)',
  'g')

let createId = function () {
    return '_' + Math.random().toString(36).substr(2, 9)
}

const state = {
    version: '',
    keyp: undefined,
    open: {
        trayData: {},
        courses: {},
        blockSelections: {},
    },
    saved: {},
}

const getters = {
    open: (state) => {
        return state.open
    },
    courses: (state) => {
        return state.open.courses
    },
    courseData: (state) => {
        return state.open.courses
    },
    blockData: (state) => {
        return state.open.blockSelections
    },
    saved: (state) => {
        return state.saved
    },
}

const actions = {
    /*==============================================================
        Trays
    ==============================================================*/
    submitText ({ commit }, trayText) {
        let parts = trayText.split(MATCH_PERIOD_HEADER).
          filter(item => item.trim())
        let termHeaders = []
        let termsBlocks = []

        for (let part of parts) {
            if (part.match(MATCH_PERIOD_HEADER) && termHeaders.length ===
              termsBlocks.length) {
                termHeaders.push(part)
            } else if (part.match(MATCH_BLOCK) && termHeaders.length >=
              termsBlocks.length) {
                let termsBlocksSeparated = [...part.matchAll(MATCH_BLOCK)]
                let coursesOfCurrentBlock = []
                for (const currentBlock of termsBlocksSeparated) {
                    let courses = [...currentBlock[1].matchAll(MATCH_COURSE)]
                    coursesOfCurrentBlock.push(courses.sort())
                }
                termsBlocks.push(coursesOfCurrentBlock)
            }
        }
        let trayData = {}
        let courses = {}
        let blockSelections = {}

        for (const [termIndex, blocks] of termsBlocks.entries()) {
            let currentPeriod = trayData[termIndex] = {
                header: termHeaders[termIndex],
                data: {},
            }
            for (const [blockIndex, block] of blocks.entries()) {
                let currentBlock = currentPeriod.data[blockIndex] = {
                    id: [termIndex, blockIndex],
                    data: {},
                }
                blockSelections[[termIndex, blockIndex].toString()] = []
                for (const [courseIndex, [fullName, shortName]] of block.entries()) {
                    let courseID = [termIndex, blockIndex, courseIndex]
                    let firstEncounter = !(shortName in courses)

                    currentBlock.data[courseIndex] = {
                        i: courseID,
                        s: shortName,
                    }
                    if (firstEncounter) {
                        courses[shortName] = {
                            f: fullName,
                            s: !1,
                            v: !0,
                            i: [],
                        }
                    } else {
                        courses[shortName].i.push(courseID)
                    }
                }
            }
        }
        commit('setTray', { trayData, courses, blockSelections })
    },
    submitPreset ({ commit }, presetName) {
        let preset = presetsData[presetName]
        commit('setTray', preset)
    },
    loadSavedTray ({ getters, commit }, id) {
        let save = JSON.parse(JSON.stringify(getters.saved[id]))
        commit('setTray', save)
    },

    saveTrayByName ({ commit }, name) {
        commit('saveTrayByName', name)
    },
    delSaveById ({ commit }, id) {
        commit('delSaveById', id)
    },

    /*==============================================================
        Courses
    ==============================================================*/
    placeCourseSelection ({ commit }, payload) {
        let {
            strParentBlockID,
            shortName,
            strCourseID,
            selectionStatus,
            courseSelected,
        } = payload
        switch (selectionStatus) {
            case 'c_available':
                commit('setCourseSelectionStatus', { shortName, value: true })
                commit('addSelectionToBlock', { strParentBlockID, strCourseID })
                break
            case 'c_inactive--unavailable':
                if (!courseSelected) {
                    commit('setCourseSelectionStatus',
                      { shortName, value: true })
                    commit('addSelectionToBlock',
                      { strParentBlockID, strCourseID })
                }
                break
            case 'c_selected':
                commit('setCourseSelectionStatus', { shortName, value: false })
                commit('rmSelectionFromBlock',
                  { strParentBlockID, strCourseID })
                break
            case 'c_forced':
                commit('setCourseSelectionStatus', { shortName, value: false })
                commit('rmSelectionFromBlock',
                  { strParentBlockID, strCourseID })
                break
        }
    },
    setCourseVisibility ({ commit }, payload) {
        commit('setCourseVisibility', payload)
    },
    setCourseVisibilityAll ({ commit }, value) {
        return new Promise((resolve) => {
            commit('setCourseVisibilityAll', { value })
            resolve()
        })
    },
}

const mutations = {
    /*==============================================================
        Trays
    ==============================================================*/
    setTray (state, payload) {
        state.keyp = Math.random().toString()
        state.open = payload
    },

    saveTrayByName (state, name) {
        let id = createId()
        let saveData = JSON.parse(JSON.stringify(state.open))
        state.saved[id] = {
            id,
            name,
            trayData: saveData.trayData,
            courses: saveData.courses,
            blockSelections: saveData.blockSelections,
        }
    },
    delSaveById (state, id) {
        delete state.saved[id]
    },

    /*==============================================================
        Courses
    ==============================================================*/
    setCourseVisibility (state, payload) {
        let { shortName, value } = payload
        state.open.courses[shortName].v = value
    },
    setCourseVisibilityAll (state, payload) {
        let { value } = payload

        let courses = Object.keys(state.open.courses)
        for (const course of courses) {
            if (!state.open.courses[course].s) {
                state.open.courses[course].v = value
            }
        }
    },

    setCourseSelectionStatus (state, payload) {
        let { short, value } = payload
        state.open.courses[short].s = value
    },

    addSelectionToBlock (state, payload) {
        let { strParentBlockID, strCourseID } = payload
        state.open.blockSelections[strParentBlockID].push(strCourseID)
    },
    rmSelectionFromBlock (state, payload) {
        let { strParentBlockID, strCourseID } = payload
        state.open.blockSelections[strParentBlockID]
          = state.open.blockSelections[strParentBlockID].filter(
          item => item !== strCourseID)
    },

    initStore (state) {
        state.keyp = Math.random().toString()
        let localVuexStore = JSON.parse(localStorage.getItem('vuex_store'))
        if (localVuexStore && localVuexStore.version === version) {
            this.replaceState(Object.assign(state, localVuexStore))
        } else {
            state.version = version

        }
    },
}

export default new Vuex.Store({
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
})
