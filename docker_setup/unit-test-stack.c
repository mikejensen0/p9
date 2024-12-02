#include "unity.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stddef.h>


void setUp(void) {
}

void tearDown(void) {
}

#define MAX_SIZE 100 
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

extern void tokenizeUserInputAndExecuteCommand(char *buffer, size_t size, Stack *s) ;


void test_initialize(){
    Stack s;
    initialize(&s);
    TEST_ASSERT_EQUAL(-1, s.top);
}

void test_isFull_true(){
    Stack s; 
    initialize(&s);
    for(int i = 0; i < MAX_SIZE; i++){
        push(&s, 20);
    }
    TEST_ASSERT_EQUAL(1, isFull(&s));
}

void test_isFull_false(){
    Stack s; 
    initialize(&s);
    push(&s, 20);
    TEST_ASSERT_EQUAL(0, isFull(&s));
}

void test_isEmpty_true(){
    Stack s; 
    initialize(&s);
    TEST_ASSERT_EQUAL(1, isEmpty(&s));
}

void test_isEmpty_false(){
    Stack s; 
    initialize(&s);
    push(&s, 20);
    TEST_ASSERT_EQUAL(0, isEmpty(&s));
}

void test_pop(){
    Stack s; 
    initialize(&s);
    push(&s, 20);
    pop(&s);
    TEST_ASSERT_EQUAL(1, isEmpty(&s));
}

void test_pop_top_index(){
    Stack s; 
    initialize(&s);
    push(&s, 20);
    pop(&s);
    TEST_ASSERT_EQUAL(-1, s.top);
}

void test_add(){
    Stack s; 
    initialize(&s);
    push(&s, 20);
    push(&s, 30);
    add(&s);
    TEST_ASSERT_EQUAL(50, s.arr[0]);
}

void test_sub(){
    Stack s; 
    initialize(&s);
    push(&s, 20);
    push(&s, 30);
    sub(&s);
    TEST_ASSERT_EQUAL(-10, s.arr[0]);
}

void test_tokenizeUserInputAndExecuteCommand_push(){
    Stack s; 
    initialize(&s);
    const char *mock_input = "[\"push 30\", \"push 50\"";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[50];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    tokenizeUserInputAndExecuteCommand(buffer, sizeof(buffer), &s);
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    // Assert expected behavior
    TEST_ASSERT_EQUAL(30, s.arr[0]);
    TEST_ASSERT_EQUAL(50, s.arr[1]);
}

void test_tokenizeUserInputAndExecuteCommand_pop(){
    Stack s; 
    initialize(&s);
    const char *mock_input = "[\"push 30\", \"pop\"";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[50];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    tokenizeUserInputAndExecuteCommand(buffer, sizeof(buffer), &s);
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    // Assert expected behavior
    TEST_ASSERT_EQUAL(1, isEmpty(&s));
}

void test_tokenizeUserInputAndExecuteCommand_add(){
    Stack s; 
    initialize(&s);
    const char *mock_input = "[\"push 30\", \"push 50\", \"add\"";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[50];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    tokenizeUserInputAndExecuteCommand(buffer, sizeof(buffer), &s);
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    // Assert expected behavior
    TEST_ASSERT_EQUAL(80, s.arr[0]);
}

void test_tokenizeUserInputAndExecuteCommand_sub(){
    Stack s; 
    initialize(&s);
    const char *mock_input = "[\"push 30\", \"push 50\", \"sub\"";
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[50];
    memset(buffer, 0, sizeof(buffer));

    // Call the function to test
    tokenizeUserInputAndExecuteCommand(buffer, sizeof(buffer), &s);
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    // Assert expected behavior
    TEST_ASSERT_EQUAL(-20, s.arr[0]);
}

int main(void) {
    UNITY_BEGIN(); 
    RUN_TEST(test_initialize);
    RUN_TEST(test_isFull_true);
    RUN_TEST(test_isFull_false);
    RUN_TEST(test_isEmpty_true);
    RUN_TEST(test_isEmpty_false);
    RUN_TEST(test_pop);
    RUN_TEST(test_pop_top_index);
    RUN_TEST(test_add);
    RUN_TEST(test_sub);
    RUN_TEST(test_tokenizeUserInputAndExecuteCommand_push);
    RUN_TEST(test_tokenizeUserInputAndExecuteCommand_pop);
    RUN_TEST(test_tokenizeUserInputAndExecuteCommand_add);
    RUN_TEST(test_tokenizeUserInputAndExecuteCommand_sub);
    return UNITY_END();  // End Unity Test Framework
}
