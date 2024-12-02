#include "unity.h"
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <string.h>

void setUp(void) {
}

void tearDown(void) {
}

#define MAX_ROWS 100
#define MAX_COLS 100

typedef struct {
    int row;
    int col;
    int dist;
} QueueNode;

extern int enqueue(QueueNode *queue, int *head, int *tail, int row, int col, int dist);

extern QueueNode dequeue(QueueNode *queue, int *head, int *tail);

extern int shortestPath(int **grid, int  rows, int cols);

void readUserDefinedGrid(char *buffer, size_t size){
    printf("Enter the 2D array in the format [[1,2,3],[4,5,6],[7,8,9]]:\n");
    fgets(buffer, size, stdin);
}

int parseUserDefinedGrid(int row_size, int col_size, char* input){
    int row = 0, col = 0;

    // Dynamically allocate memory for the 2D grid
    int **realArray = (int **)malloc(row_size * sizeof(int *));
    for (int i = 0; i < row_size; i++) {
        realArray[i] = (int *)malloc(col_size * sizeof(int));
    }

    // Parse the input string
    char *ptr = strtok(input, "[],"); // Split by '[', ']', and ','
    while (ptr != NULL) {
        if (row < row_size && col < col_size) {
            realArray[row][col] = atoi(ptr); // Convert token to integer
            col++;
            if (col == col_size) { // Move to the next row when COLS is filled
                col = 0;
                row++;
            }
        }
        ptr = strtok(NULL, "[],"); // Get the next token
    }

    // Call the shortestPath function with the dynamically allocated array
    int shortest_path = shortestPath(realArray, row_size, col_size);

    // Free dynamically allocated memory
    for (int i = 0; i < row_size; i++) {
        free(realArray[i]);
    }
    free(realArray);

    return shortest_path;
}

void test_path_on_3x3_grid() {
    const char *mock_input = "[[2,0,0],[1,0,0],[2,0,0]]";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[1024];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    readUserDefinedGrid(buffer, sizeof(buffer));
    int shortest_path = parseUserDefinedGrid(3, 3, buffer);
    
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    
    TEST_ASSERT_EQUAL(4, shortest_path);  // Verify that the expected output is correct
}

void test_path_on_4x4_grid() {
    const char *mock_input = "[[2,0,0, 0],[1,1,1, 0],[0,0,1, 0],[2,0,0,0]]";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[1024];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    readUserDefinedGrid(buffer, sizeof(buffer));
    int shortest_path = parseUserDefinedGrid(4, 4, buffer);
    
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    
    TEST_ASSERT_EQUAL(9, shortest_path);  // Adjust expected value if necessary
}

void test_path_on_4x3_grid() {
    const char *mock_input = "[[2,0,0, 0],[1,1,1, 0],[2,0,0, 0]]";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[1024];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    readUserDefinedGrid(buffer, sizeof(buffer));
    int shortest_path = parseUserDefinedGrid(4, 4, buffer);
    
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    
    TEST_ASSERT_EQUAL(8, shortest_path);  // Adjust expected value if necessary
}

void test_path_on_3x4_grid() {
    const char *mock_input = "[[2,0,0],[1,1, 0],[0,1,0],[2,0,0]]";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[1024];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    readUserDefinedGrid(buffer, sizeof(buffer));
    int shortest_path = parseUserDefinedGrid(4, 4, buffer);
    
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    
    TEST_ASSERT_EQUAL(7, shortest_path);  // Adjust expected value if necessary
}

int main(void) {
    UNITY_BEGIN(); 
    RUN_TEST(test_path_on_3x3_grid);
    RUN_TEST(test_path_on_4x4_grid);
    RUN_TEST(test_path_on_4x3_grid);
    RUN_TEST(test_path_on_4x3_grid);
    return UNITY_END();  // End Unity Test Framework
}
