#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <string.h>

#define MAX_ROWS 100
#define MAX_COLS 100

// Structure to represent a queue node
typedef struct {
    int row;
    int col;
    int dist;
} QueueNode;

// Function to add a node to the queue
int enqueue(QueueNode *queue, int *head, int *tail, int row, int col, int dist) {
    if (*tail == MAX_ROWS * MAX_COLS) return 0; // Queue full
    queue[++(*tail)].row = row;
    queue[*tail].col = col;
    queue[*tail].dist = dist;
    return 1;
}

// Function to remove a node from the queue
QueueNode dequeue(QueueNode *queue, int *head, int *tail) {
    if (*head > *tail) {
        QueueNode empty = {-1, -1, -1}; // Return a dummy node if queue is empty
        return empty;
    }
    return queue[++(*head)];
}

// Function to find the shortest path in a grid
int shortestPath(int **grid, int rows, int cols) {
    int start_row = -1, start_col = -1, end_row = -1, end_col = -1;

    // Find start and end points
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == 2) {
                if (start_row == -1) {
                    start_row = i;
                    start_col = j;
                } else {
                    end_row = i;
                    end_col = j;
                }
            }
        }
    }

    if (start_row == -1 || end_row == -1) return -1; // Start or end not found

    QueueNode queue[rows * cols];
    int head = -1, tail = -1;
    bool visited[rows][cols];
    memset(visited, false, sizeof(visited));

    enqueue(queue, &head, &tail, start_row, start_col, 0);
    visited[start_row][start_col] = true;

    int row_dir[] = {-1, 1, 0, 0}; // up, down, left, right
    int col_dir[] = {0, 0, -1, 1};

    while (head < tail) {
        QueueNode current = dequeue(queue, &head, &tail);
        int row = current.row;
        int col = current.col;
        int dist = current.dist;

        if (row == end_row && col == end_col) return dist;

        for (int i = 0; i < 4; i++) {
            int new_row = row + row_dir[i];
            int new_col = col + col_dir[i];

            if (new_row >= 0 && new_row < rows && new_col >= 0 && new_col < cols &&
                grid[new_row][new_col] != 1 && !visited[new_row][new_col]) {
                enqueue(queue, &head, &tail, new_row, new_col, dist + 1);
                visited[new_row][new_col] = true;
            }
        }
    }

    return -1; // No path found
}

// Function to count brackets and commas in the input string
void countBracketsAndCommas(const char *input, int *openBrackets, int *closeBrackets, int *commas) {
    *openBrackets = 0;
    *closeBrackets = 0;
    *commas = 0;

    int insideInnerArray = 0; // Flag to track if we're inside an inner array

    for (int i = 0; input[i] != '\0'; i++) {
        if (input[i] == '[') {
            (*openBrackets)++;
            insideInnerArray = 1; // Start of an inner array
        } else if (input[i] == ']') {
            (*closeBrackets)++;
            insideInnerArray = 0; // End of an inner array
        } else if (input[i] == ',' && insideInnerArray) {
            (*commas)++;
        }
    }
}

int main() {
    char input[1024];
    printf("Enter the 2D array in the format [[1,2,3],[4,5,6],[7,8,9]]:\n");
    fgets(input, sizeof(input), stdin);

    int openBrackets, closeBrackets, commas;
    countBracketsAndCommas(input, &openBrackets, &closeBrackets, &commas);
    
    int cols = openBrackets - 1; // Number of columns
    int rows = commas / cols + 1; // Number of rows

    // Dynamically allocate memory for the grid
    int **realArray = (int **)malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) {
        realArray[i] = (int *)malloc(cols * sizeof(int));
    }

    int row = 0, col = 0;
    char *ptr = strtok(input, "[],"); // Split by '[', ']', and ','
    while (ptr != NULL) {
        if (row < rows && col < cols) {
            realArray[row][col] = atoi(ptr); // Convert token to integer
            col++;
            if (col == cols) { // Move to the next row when COLS is filled
                col = 0;
                row++;
            }
        }
        ptr = strtok(NULL, "[],"); // Get the next token
    }

    int shortest_distance = shortestPath(realArray, rows, cols);

    if (shortest_distance != -1) {
        printf("Shortest path length: %d\n", shortest_distance);
    } else {
        printf("No path found.\n");
    }

    // Free the dynamically allocated memory
    for (int i = 0; i < rows; i++) {
        free(realArray[i]);
    }
    free(realArray);

    return 0;
}