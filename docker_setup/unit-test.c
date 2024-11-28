#include "unity.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

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

#ifdef TEST_CASE_1
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
#endif

#ifdef TEST_CASE_2
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
#endif
void test_add_positive() {
    Stack s;  
    initialize(&s);
    push(&s, 20);
    TEST_ASSERT(s.arr[0] == 20);
}

void test_add_positie() {
    Stack s;  
    initialize(&s);
    TEST_ASSERT(s.arr[0] == 19);
}
int main(void) {
    UNITY_BEGIN(); 
    const char* somt_var = getenv("SOMT_VAR");
    if (strcmp(somt_var, "nav") == 0) {
        RUN_TEST(test_add_positive);    } else {
        RUN_TEST(test_add_positie); 
}    ///TEST_ASSERT(20 == push(&s, 20));// Start Unity Test Framework
    return UNITY_END();  // End Unity Test Framework
}
