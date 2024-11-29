#include "unity.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stddef.h>

//extern int add(int a, int b); // This will be defined by the user-supplied code
//extern int sub(int a, int b);

void setUp(void) {
}

void tearDown(void) {
}
/*
void test_add_positive() {
    TEST_ASSERT_EQUAL(5, add(2, 3));
}

void test_add_negative() {
    TEST_ASSERT_EQUAL(-1, add(-2, 1));
}

void test_sub_positive() {
    TEST_ASSERT_EQUAL(5, sub(7, 2));
}

void test_sub_negative() {
    TEST_ASSERT_EQUAL(-1, sub(1, 2));
}
*/
//Stacktests
/*
#define MAX_SIZE 100 // Define the maximum size of the stack
#define MAX_INPUT_LENGTH 1000
typedef struct {
    int arr[MAX_SIZE];
    int top;
} Stack;

extern void initialize(Stack *s);

// Check if the stack is full
extern int isFull(Stack *s);

// Check if the stack is empty
extern int isEmpty(Stack *s);
// Push an element onto the stack
extern void push(Stack *s, int value);

// Pop an element from the stack
extern int pop(Stack *s) ;

// Add the top two elements
extern void add(Stack *s) ;
// Subtract the top two elements (top - second top)
extern void sub(Stack *s) ;

extern void read_user_input(char* buffer)

void test_add_positive() {
    Stack s;  
    initialize(&s);
    push(&s, 20);
    TEST_ASSERT(s.arr[0] == 20);
}
*/
void test_read_user_input(){
    const char *mock_input = "Test input\n";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[50];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    read_user_input(buffer, sizeof(buffer));
    
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);

    // Assert expected behavior
    TEST_ASSERT_EQUAL_STRING("Test input\n", buffer);
}


int main(void) {
    UNITY_BEGIN(); 
   // RUN_TEST(test_add_positive);   
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);
    RUN_TEST(test_read_user_input);

    return UNITY_END();  // End Unity Test Framework
}
