

let table = document.querySelector("#grid");

let grid = [];

class cell {

    value = null;
    imp = [];

    editable = true;

    condition = true;

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.cell = getCellData(x, y)

        this.cell.innerText = this.value;
    }

    set newValue(newValue) {
        this.value = newValue;
        this.cell.innerText = newValue;
    }

    check(value, oldValue) {

        let index = this.imp.indexOf(oldValue);
        if (index > -1) { this.imp.splice(index, 1) }

        this.imp.push(value);

        this.condition = true;

        for (let el of this.imp) {
            if (this.imp.indexOf(el) != this.imp.lastIndexOf(el)) {
                if (el == this.value) {
                    this.condition = false;
                }
            }
        }

        let color = this.condition ? "color:black" : "color:#e26d5c";
        this.cell.setAttribute("style", color);
    }

}

function getCellData(x, y) {

    let rowGroup = y <= 3 ? 0 : y <= 6 ? 1 : 2;

    let tableRow = table.querySelectorAll("tbody")[rowGroup];

    let offset = rowGroup * 3;

    let row = tableRow.querySelectorAll("tr")[(y - offset) - 1];

    let cell = row.querySelectorAll("td")[x - 1];

    return cell;
}

function setValue(x, y, value) {
    
    if (grid[x][y].editable) {

        let oldValue = grid[x][y].value;

        grid[x][y].newValue = value;

        let rowGroup = y <= 3 ? 0 : y <= 6 ? 1 : 2;
        let colGroup = x <= 3 ? 0 : x <= 6 ? 1 : 2;

        let arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

        // propagate row and col //
        arr.map(group => {
            if (group != arr[rowGroup]) {
                for (let i = 0; i < 3; i++) {
                    grid[x][group[i]].check(value, oldValue);
                }
            }
        })
        arr.map(group => {
            if (group != arr[colGroup]) {
                for (let i = 0; i < 3; i++) {
                    grid[group[i]][y].check(value, oldValue);
                }
            }
        })
        // propagate block //
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) { // esto va a checkear el casillero original
                grid[arr[colGroup][j]][arr[rowGroup][i]].check(value, oldValue);
            }
        }
    }

}

function isItBroken(x, y) {
    let arr = Array.from(new Set(grid[x][y].imp));
    return arr.length == 9
}

/// GENERATE GAME ///

function generate() {

    for (let i = 1; i <= 9; i++) {
        grid[i] = [null]; // para mantener el criterio de numeracion
        for (let j = 1; j <= 9; j++) {
            let instance = new cell(i, j)
            grid[i].push(instance);
        }
    }

    let cellsArray = Array.from(Array(81).keys());

    for (let i = 0; i < 25; i++) {

        let n = cellsArray[Math.floor(Math.random() * cellsArray.length)];

        let x = Math.floor(n / 9) + 1;
        let y = n - Math.floor(n / 9) * 9 + 1;

        do {
            let value = Math.floor(Math.random() * 9) + 1;
            setValue(x, y, value);
        } while (!grid[x][y].condition)

        if (check()) {
            cellsArray.splice(cellsArray.indexOf(n), 1);
            grid[x][y].cell.classList.add("grey")
            grid[x][y].editable = false;
        } else {
            setValue(x, y, null);
        }

    }

    function check() {
        let ans = true;
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (isItBroken(i, j) && grid[i][j].value == null) {
                    ans = false;
                }
            }
        }
        return ans;
    }

}

generate();

// text //

let canWrite = true;

function write(user, text) {

    function isAnswer(text){
        if(text.length != 4) { return false }
        if(!text[0].match(/[0-9]/i)){return false}
        if(!text[1].match(/[a-z]/i)){return false}
        if(text[2] != ":") { return false }
        if(!text[3].match(/[0-9]/i)){return false}
        return true;
    }

    if(isAnswer(text)){
        let Arr = ["A","B","C","D","E","F","G","H","I"];
        let num = Arr.indexOf(text[1].toUpperCase()) + 1;
        setValue(text[0],num,text[3]);
        return
    }

    if (canWrite) {
        if (text.length >= 25) { text = text.slice(0,25) + "..."}
        canWrite = false;
        typeDeletter();
    }

    function typeDeletter() {
        let el = document.querySelector("#text");
        if (el.innerText.length > 0) {
            el.innerText = el.innerText.slice(1);
            setTimeout(typeDeletter, 80);
        } else {
            setTimeout(function () { typeWritter(user, text) }, 100);
        }
    }

    function typeWritter(user, text, step = 0) {
        let el = document.querySelector("#text");

        let newText = user + ": " + text;

        if (step < newText.length) {
            el.innerHTML += newText.charAt(step);
            setTimeout(function () { typeWritter(user, text, step + 1) }, 75);
        } else (canWrite = true);
    }

}

// event //

document.addEventListener("onComment",
    (event) => {
        write("u/"+event.detail.user,event.detail.text)
    }
)