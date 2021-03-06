import fs from "fs";
import _ from "lodash";
import {addFiles, updateFiles} from "./actions/actions.js";
import dotenv from "dotenv"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const testPath = join(dirname(fileURLToPath(import.meta.url)), '/testFiles/');
const PATH = process.env.FILES_PATH || testPath

dotenv.config();

export function getFiles(currentState) {
    const files = fs.readdirSync(PATH)

    if (currentState === [])
        getInitialFiles(files)
    else
        checkFilesUpdate(currentState)
}

function getInitialFiles(files) {
    let filesArray = []
    files.forEach(file => {
        filesArray.push({name: file, active: true})
    })
    addFiles(filesArray)
}

function checkFilesUpdate(currentState) {

    let stateFiles = []
    const directoryFiles = fs.readdirSync(PATH)
    currentState.forEach(file => {
        stateFiles.push(file.name)
    })

    const newFilesAdded = _.difference(directoryFiles, stateFiles)
    const removedFiles = _.difference(stateFiles, directoryFiles)
    const intersectingFiles = _.intersection(directoryFiles, stateFiles)

    getUpdatedFiles(newFilesAdded, removedFiles, intersectingFiles)
}
function getUpdatedFiles(newFilesAdded = null, removedFiles = null, intersectingFiles) {
    let newStateArray = []

    newFilesAdded.forEach(file => {
        newStateArray.push({name: file, active: true})
    })

    removedFiles.forEach(file => {
        newStateArray.push({name: file, active: false})
    })

    intersectingFiles.forEach(file => {
        newStateArray.push({name: file, active: true})
    })

    updateFiles(newStateArray)
}
