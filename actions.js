
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 600;
    let rows = 30;
    let cols = 30;
    let cellSize = canvas.width / cols;
    const grid = [];
    const stack = [];
    
    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.walls = { top: true, right: true, bottom: true, left: true };
            this.visited = false;
        }
    
        draw() {
            const x = this.x * cellSize;
            const y = this.y * cellSize;
            ctx.strokeStyle = "white";
            
            if (this.walls.top)    ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y), ctx.stroke();
            if (this.walls.right)  ctx.beginPath(), ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
            if (this.walls.bottom) ctx.beginPath(), ctx.moveTo(x + cellSize, y + cellSize), ctx.lineTo(x, y + cellSize), ctx.stroke();
            if (this.walls.left)   ctx.beginPath(), ctx.moveTo(x, y + cellSize), ctx.lineTo(x, y), ctx.stroke();
        }
    }
    
    function setup() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                grid.push(new Cell(x, y));
            }
        }
        current = grid[0];
        current.visited = true;
        stack.push(current);
        generateMaze();
        draw();
    }
    
    function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        grid.forEach(cell => cell.draw());
    }
    
    function index(x, y) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
        return x + y * cols;
    }
    
    function removeWalls(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        if (dx === 1) { a.walls.left = false; b.walls.right = false; }
        if (dx === -1) { a.walls.right = false; b.walls.left = false; }
        if (dy === 1) { a.walls.top = false; b.walls.bottom = false; }
        if (dy === -1) { a.walls.bottom = false; b.walls.top = false; }
    }
    
    function getUnvisitedNeighbors(cell) {
        let neighbors = [];
        let directions = [
            { x: 0, y: -1 }, // top
            { x: 1, y: 0 }, // right
            { x: 0, y: 1 }, // bottom
            { x: -1, y: 0 } // left
        ];
        for (let { x, y } of directions) {
            let neighbor = grid[index(cell.x + x, cell.y + y)];
            if (neighbor && !neighbor.visited) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }
    
    function generateMaze() {
        while (stack.length > 0) {
            let neighbors = getUnvisitedNeighbors(current);
            if (neighbors.length > 0) {
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                removeWalls(current, next);
                next.visited = true;
                stack.push(next);
                current = next;
            } else {
                current = stack.pop();
            }
        }
    }
    
    setup();



    // Explore Button ->
    document.getElementById("explore").addEventListener("click", function e() {
        front.style.display = "none";
    });
        // for Length and Breadth Adjustment Div ->
        // Generate Maze Header Button ->
        // let done = false;
        document.getElementById("generate").addEventListener("click", function reload_random_maze(){
            grid.length = 0;
            stack.length = 0;
            let input_rows = document.getElementById("bre");
            let input_cols = document.getElementById("len");
            if(input_rows!=null && input_cols!=null){
                rows = input_rows.value;
                cols = input_cols.value;
                cellSize = canvas.width / cols;
            }
            // if(done)
            // {path.length = 0;
            // queue_BFS.length = 0;
            // stack_DFS.length = 0;
            // }
            setup();
        });
        
        // Helper: Get accessible (non-wall blocked) neighbors of a cell
function getAccessibleNeighbors(cell) {
    let neighbors = [];
    // Top neighbor
    let topIndex = index(cell.x, cell.y - 1);
    if (topIndex !== -1) {
        let topCell = grid[topIndex];
        if (!cell.walls.top && !topCell.walls.bottom) neighbors.push(topCell);
    }
    // Right neighbor
    let rightIndex = index(cell.x + 1, cell.y);
    if (rightIndex !== -1) {
        let rightCell = grid[rightIndex];
        if (!cell.walls.right && !rightCell.walls.left) neighbors.push(rightCell);
    }
    // Bottom neighbor
    let bottomIndex = index(cell.x, cell.y + 1);
    if (bottomIndex !== -1) {
        let bottomCell = grid[bottomIndex];
        if (!cell.walls.bottom && !bottomCell.walls.top) neighbors.push(bottomCell);
    }
    // Left neighbor
    let leftIndex = index(cell.x - 1, cell.y);
    if (leftIndex !== -1) {
        let leftCell = grid[leftIndex];
        if (!cell.walls.left && !leftCell.walls.right) neighbors.push(leftCell);
    }
    return neighbors;
}

// Helper: Reconstruct the path using the parent pointers
function reconstructPath(end) {
    let path = [];
    let current = end;
    while (current) {
        path.push(current);
        current = current.parent;
    }
    return path.reverse();
}

// BFS algorithm for maze solving
function solveMazeBFS(start, end) {
    // Reset search state for all cells
    grid.forEach(cell => {
        cell.parent = null;
        cell.visitedInSolve = false;
    });
    
    let queue_BFS = [];
    start.visitedInSolve = true;
    queue_BFS.push(start);
    
    while (queue_BFS.length > 0) {
        let current = queue_BFS.shift();
        if (current === end) return reconstructPath(end);
        
        let neighbors = getAccessibleNeighbors(current);
        for (let neighbor of neighbors) {
            if (!neighbor.visitedInSolve) {
                neighbor.visitedInSolve = true;
                neighbor.parent = current;
                queue_BFS.push(neighbor);
            }
        }
    }
    return []; // No path found
}

// DFS algorithm for maze solving
function solveMazeDFS(start, end) {
    // Reset search state for all cells
    grid.forEach(cell => {
        cell.parent = null;
        cell.visitedInSolve = false;
    });
    
    let stack_DFS = [];
    start.visitedInSolve = true;
    stack_DFS.push(start);
    
    while (stack_DFS.length > 0) {
        let current = stack_DFS.pop();
        if (current === end) return reconstructPath(end);
        
        let neighbors = getAccessibleNeighbors(current);
        for (let neighbor of neighbors) {
            if (!neighbor.visitedInSolve) {
                neighbor.visitedInSolve = true;
                neighbor.parent = current;
                stack_DFS.push(neighbor);
            }
        }
    }
    return []; // No path found
}
// Animate the solution path on the canvas
function animatePath(path) {
    let i = 0;
    function step() {
        if (i < path.length) {
            let cell = path[i];
            let x = cell.x * cellSize;
            let y = cell.y * cellSize;
            ctx.fillStyle = "blue";
            ctx.fillRect(x, y, cellSize-3, cellSize-3);
            i++;
            setTimeout(step, 30); // Adjust delay (in ms) for animation speed
        }
    }
    step();
    
}

let startCell = grid[index(0, 0)];
let endCell = grid[index(cols - 1, rows - 1)];






// For Algoritm button DIV logics ->
        document.getElementById("BFS").addEventListener("click", function BFS(){
            let pathBFS = solveMazeBFS(startCell, endCell);
            animatePath(pathBFS); 
            if(path.length!=0){
                path.length = 0;
            }
        });
        document.getElementById("DFS").addEventListener("click", function DFS(){
            let pathDFS = solveMazeDFS(startCell, endCell);
            animatePath(pathDFS);
            path.length = 0;
        });
        document.getElementById("Dijkstra").addEventListener("click", function Dijkstra(){});
        document.getElementById("AStar").addEventListener("click", function AStar(){});