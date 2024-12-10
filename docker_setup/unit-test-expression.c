#include "unity.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>


void setUp(void) {
}

void tearDown(void) {
}

typedef struct {
    char type; // '+' '-' '*' '/' '(' ')' 'n' (number)
    double value;
} Token;

extern Token* tokenize(const char* expression, int* tokenCount);

extern double parseExpression(Token* tokens, int* index);

extern double parseTerm(Token* tokens, int* index);

extern double parseFactor(Token* tokens, int* index);

extern void getExpression(char *expression, size_t size);

double result(const char *mock_input){
    FILE *mock_stdin = fmemopen((void *)mock_input, strlen(mock_input), "r");
    TEST_ASSERT_NOT_NULL_MESSAGE(mock_stdin, "Failed to create mock stdin");
    
    // Replace stdin temporarily
    FILE *original_stdin = stdin;
    stdin = mock_stdin;
    char expression[100];
    memset(expression, 0, sizeof(expression));
    getExpression(expression, sizeof(expression));

    // Call the function to test
    // Restore original stdin
    stdin = original_stdin;
    fclose(mock_stdin);
    int tokenCount;
    Token* tokens = tokenize(expression, &tokenCount);

    int index = 0;
    double result = parseExpression(tokens, &index);
    free(tokens);
    return result;
}

void test_simple_addition(){
    const char* mock_input = "2 + 2";
    TEST_ASSERT_EQUAL(4, result(mock_input));
}

void test_advanced_addition(){
    const char* mock_input = "2 + 2 + 3 + 5 + 10";
    TEST_ASSERT_EQUAL(22, result(mock_input));
}

void test_simple_subtraction(){
    const char* mock_input = "2 - 2";
    TEST_ASSERT_EQUAL(0, result(mock_input));
}

void test_advanced_subtraction(){
    const char* mock_input = "2 - 2 - 3 - 5 - 10";
    TEST_ASSERT_EQUAL(-18, result(mock_input));
}

void test_simple_multiplication(){
    const char* mock_input = "3 * 3";
    TEST_ASSERT_EQUAL(9, result(mock_input));
}

void test_advanced_multiplication(){
    const char* mock_input = "2 * 2 * 3 * 5 * 10";
    TEST_ASSERT_EQUAL(600, result(mock_input));
}

void test_simple_division(){
    const char* mock_input = "2 / 2";
    TEST_ASSERT_EQUAL(1, result(mock_input));
}

void test_advanced_division(){
    const char* mock_input = "100 / 5 / 10 / 2";
    TEST_ASSERT_EQUAL(1, result(mock_input));
}

void test_order_of_operations(){
    const char* mock_input = "2 + 2 * 3";
    TEST_ASSERT_EQUAL(8, result(mock_input));
}

void test_parameters(){
    const char* mock_input = "(2 + 2) * 3";
    TEST_ASSERT_EQUAL(12, result(mock_input));
}

int main(void) {
    UNITY_BEGIN(); 
    RUN_TEST(test_simple_addition);
    RUN_TEST(test_advanced_addition);
    RUN_TEST(test_simple_subtraction);
    RUN_TEST(test_advanced_subtraction);
    RUN_TEST(test_simple_multiplication);
    RUN_TEST(test_advanced_multiplication);
    RUN_TEST(test_simple_division);
    RUN_TEST(test_advanced_division);
    RUN_TEST(test_order_of_operations);
    RUN_TEST(test_parameters);
    return UNITY_END();  // End Unity Test Framework
}
