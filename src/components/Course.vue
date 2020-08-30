<template>
    <a v-show="isVisible" type="button"
       :class="['c mb-1', selectionStatus, this.$vuetify.theme.dark ? 'dark' : '']"
       @click="select"
    >
        {{ this.otherValues.f }}
    </a>
</template>

<script>
export default {
    name: 'Course',
    props: ['course'],
    data () {
        return {
            courseID: this.course.i,
            short: this.course.s,
        }
    },
    computed: {
        otherValues () {
            return this.$store.getters.courseData[this.short]
        },
        isVisible () {
            return this.otherValues.v
        },
        isSelected () {
            return this.$store.getters.courseData[this.short].s
        },
        strCourseID () {
            return this.courseID.toString()
        },
        strParentBlockID () {
            return this.courseID.slice(0, 2).toString()
        },
        parentBlockSelections () {
            return this.$store.getters.blockData[this.strParentBlockID]
        },
        selectionStatus () {
            if (this.isSelected) {
                if (this.strCourseID === this.parentBlockSelections[0]) {
                    return 'c_selected'
                } else if (this.parentBlockSelections.includes(this.strCourseID)) {
                    return 'c_forced'
                } else {
                    return 'c_selected--other'
                }
            } else if (this.parentBlockSelections.length > 0) {
                return 'c_inactive--unavailable'
            } else {
                return 'c_available'
            }
        },
    },
    methods: {
        select () {
            let value = 'none'
            switch (this.selectionStatus) {
                case 'c_available':
                    value = true
                    break
                case 'c_inactive--unavailable':
                    if (!this.isSelected) {
                        value = true
                    }
                    break
                case 'c_selected':
                    value = false
                    break
                case 'c_forced':
                    value = false
                    break
            }
            if (value !== 'none') {
                if (value) {
                    this.$store.commit(
                        'addSelectionToBlock',
                        {
                            strParentBlockID: this.strParentBlockID,
                            strCourseID: this.strCourseID,
                        },
                    )
                } else {
                    this.$store.commit(
                        'rmSelectionFromBlock',
                        {
                            strParentBlockID: this.strParentBlockID,
                            strCourseID: this.strCourseID,
                        },
                    )
                }
                this.$store.commit('setCourseSelectionStatus', {
                    short: this.course.s,
                    value,
                })
            }
        },
    },
}
</script>

<style lang="scss">

$green: rgba(151, 255, 183, 1.0);
$green2: change-color($green, $lightness: 65%, $saturation: 40%);
$green-top: change-color($green, $lightness: 100%, $saturation: 5%);
$green-bottom: change-color($green, $lightness: 40%, $saturation: 60%);

$blue: rgba(173, 238, 255, 1.0);
$blue2: change-color($blue, $lightness: 65%, $saturation: 40%);
$blue-top: change-color($blue, $lightness: 100%, $saturation: 5%);
$blue-bottom: change-color($blue, $lightness: 40%, $saturation: 60%);

$red: rgb(253, 182, 182);
$red2: change-color($red, $lightness: 68%, $saturation: 66%);
$red-top: change-color($red, $lightness: 100%, $saturation: 5%);
$red-bottom: change-color($red, $lightness: 40%, $saturation: 60%);

$grey: rgb(245, 245, 245);
$grey2: change-color($grey, $lightness: 75%);
$grey-top: change-color($grey, $lightness: 100%);
$grey-bottom: change-color($grey, $lightness: 40%);


.c {
    user-select: none; /* standard syntax */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -ms-user-select: none; /* IE10+ */
    color: #282828 !important;
    display: inline-block;
    font-size: 0.9rem;
    line-height: 0.90rem;

    padding: 0.20rem;
    margin: 0 4px 0 0;

    border-style: inset;
    border-width: 1px;
    border-radius: 5px;
    outline-style: none;
    cursor: pointer;
}

.dark {
    color: #f1f1f1 !important;
    box-shadow: inset 0 0 0 0 transparent !important;
    border-style: double;
}

.c:active {
    position: relative;
    top: 1px;
}

.c:hover {
    position: relative;
    bottom: 1px;
}


.c_available {
    box-shadow: inset 1px 1px 0 0 #ffffff;
    background: $blue linear-gradient(to bottom, $blue 5%, $blue2 100%);
    border-top-color: $blue-top;
    border-bottom-color: $blue-bottom;
    border-right-color: $blue-bottom;
    border-left-color: $blue-top;
    border-width: 1px;
}

.c_available.dark {
    background: change-color($blue, $alpha: 0.1, $lightness: 30%) !important;
    border-top-color: $blue-bottom;
    border-left-color: $blue-bottom;
}

.c_available:active {
    background: $blue linear-gradient(to bottom, $blue2 5%, $blue 100%);
}

.c_inactive {
    box-shadow: inset 1px 1px 0 0 #ffffff;
    background: $grey linear-gradient(to bottom, $grey 5%, $grey2 100%);
    border-top-color: $grey-top;
    border-bottom-color: $grey-bottom;
    border-right-color: $grey-bottom;
    border-left-color: $grey-top;

    &--unavailable {
        @extend .c_inactive;
        opacity: 0.4 !important;
    }
}

.c_inactive.dark {
    background: change-color($grey, $alpha: 0.1, $lightness: 30%) !important;
    border-top-color: $grey-bottom;
    border-left-color: $grey-bottom;
}

.c_inactive:active {
    background: $grey linear-gradient(to bottom, $grey2 5%, $grey 100%);
}

.c_selected {
    box-shadow: inset 1px 1px 0 0 #ffffff;
    background: $green linear-gradient(to bottom, $green 5%, $green2 100%);
    border-top-color: $green-top;
    border-bottom-color: $green-bottom;
    border-right-color: $green-bottom;
    border-left-color: $green-top;

    &--other {
        @extend .c_selected;
        opacity: 0.4 !important;
    }
}

.c_selected.dark {
    background: change-color($green, $alpha: 0.1, $lightness: 30%) !important;
    border-top-color: $green-bottom;
    border-left-color: $green-bottom;
}

.c_selected:active {
    background: $green linear-gradient(to bottom, $green2 5%, $green 100%);
}

.c_forced {
    box-shadow: inset 1px 1px 0 0 #ffffff;
    background: $red linear-gradient(to bottom, $red 5%, $red2 100%);
    border-top-color: $red-top;
    border-bottom-color: $red-bottom;
    border-right-color: $red-bottom;
    border-left-color: $red-top;
}

.c_forced.dark {
    background: change-color($red, $alpha: 0.1, $lightness: 30%) !important;
    border-top-color: $red-bottom;
    border-left-color: $red-bottom;
}

.c_forced:active {
    background: $red linear-gradient(to bottom, $red2 5%, $red 100%);
}
</style>
