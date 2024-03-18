// Copyright (c) Matěj Petříček 2024. Všechna práva vyhrazena.

const ITEM_LIST_NAME = "itemList";

let info = document.querySelector(".info");
let items = document.querySelector(".items");
let form = document.querySelector("form");
let input = document.querySelector(".input");

console.assert(info != null);
console.assert(items != null);
console.assert(form != null);
console.assert(input != null);

let total = 0;
let done = 0;

let itemList = [];

function getSaved() {
    let itemsJson = localStorage.getItem(ITEM_LIST_NAME)
    if (itemsJson !== null) {
        newItemList = JSON.parse(itemsJson);

        newItemList.forEach(task => {
            if (task.empty === false) {
                addTask(task);
                if (task.done === true) {
                    done++;
                }
            }
        });
    }

    info.textContent = `${done}/${total} done`
}

function save() {
    localStorage.setItem(ITEM_LIST_NAME, JSON.stringify(itemList))
}

function update() {
    info.textContent = `${done}/${total} done`
    save();
}

getSaved();

function addTask(taskObj) {
    items.insertAdjacentHTML("beforeend",
    `<div class="item">
        <div class="text"></div>
        <button class="removebutton"><i class="material-symbols-outlined">delete</i></button>
    </div>`);

    let task = taskObj.task

    let item = items.lastElementChild;
    item.querySelector(".text").textContent = task;

    itemList.push(taskObj);
    let itemIndex = itemList.length - 1;

    console.assert(item != null);

    let removeB = item.querySelector(".removebutton");

    if (taskObj.done) {
        item.classList.add("done");
    }

    function removeClick() {
        if (!item.classList.contains("done")) {
            // Doesn't make sense why but tasks get done when clicking delete
            done--;
            itemList[itemIndex].done = false;
        }
        total--;
        item.remove();
        itemList[itemIndex].empty = true; // To keep index
        itemList[itemIndex].task = "";

        update();
    }

    function doneClick () {
        if (!item.classList.contains("done")) {
            console.log(`Task ${task} done`);
    
            item.classList.add("done");
            itemList[itemIndex].done = true;
        
            done++;
            update();
        }
        else {
            console.log(`Task ${task} undone`);
    
            item.classList.remove("done");
            itemList[itemIndex].done = true;
        
            done--;
            update();
        }
    }

    item.onclick = doneClick;
    removeB.onclick = removeClick;

    total++;
}

form.onsubmit = function(e) {
    e.preventDefault();

    let task = input.value.trim();

    input.value = "";

    if (task.length < 1) {
        console.log("Skipping adding empty string.");
        return;
    }

    console.log("Adding task: \"" + task + "\"");

    addTask({task: task, done: false, empty: false});

    console.log("Added task.");

    update();
}