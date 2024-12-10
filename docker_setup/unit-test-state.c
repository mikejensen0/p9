#include "unity.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include <stddef.h>


void setUp(void) {
}

void tearDown(void) {
}
// Define the states
typedef enum {
  OPENED,
  CLOSED,
  LOCKED,
} DoorState;

extern DoorState transition(const char* action);

extern void printState();

extern DoorState returnState();

extern void resetState();

extern void tokenizeUserInputAndExecuteStateChanges(char *buffer, size_t size);

void run_state_machine(const char *mock_input){
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char buffer[100];
    memset(buffer, 0, sizeof(buffer));
    tokenizeUserInputAndExecuteStateChanges(buffer, sizeof(buffer));

    // Call the function to test
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
}

void test_transition_lock(){
    const char *mock_input = "[\"LOCK\"]";
    run_state_machine(mock_input);
    TEST_ASSERT_EQUAL(LOCKED, returnState());
    resetState();
}

void test_transition_open(){
    const char *mock_input = "[\"OPEN\"]";
    run_state_machine(mock_input);
    TEST_ASSERT_EQUAL(OPENED, returnState());
    resetState();
}

void test_transition_close(){
    const char *mock_input = "[\"OPEN\", \"CLOSE\"]";
    run_state_machine(mock_input);
    TEST_ASSERT_EQUAL(CLOSED, returnState());
    resetState();
}

void test_transition_unlock(){
    const char *mock_input = "[\"LOCK\", \"UNLOCK\"]";
    run_state_machine(mock_input);
    TEST_ASSERT_EQUAL(CLOSED, returnState());
    resetState();
}

void test_extended_transitons(){
    const char *mock_input = "[\"LOCK\", \"UNLOCK\"], \"OPEN\". \"CLOSE\", \"LOCK\". \"UNLOCK\", \"LOCK\"";
    run_state_machine(mock_input);
    TEST_ASSERT_EQUAL(LOCKED, returnState());
    resetState();
}
int main(void) {
    UNITY_BEGIN(); 
    RUN_TEST(test_transition_lock);
    RUN_TEST(test_transition_open);
    RUN_TEST(test_transition_close);
    RUN_TEST(test_transition_unlock);
    RUN_TEST(test_extended_transitons);
    return UNITY_END();  // End Unity Test Framework
}
