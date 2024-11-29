#include "unity.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

void setUp(void) {
}

void tearDown(void) {
}


extern int navSomething();

void test_add_positive() {
    TEST_ASSERT(navSomething() == 10);
}
int main(void) {
    UNITY_BEGIN(); 
    RUN_TEST(test_add_positive);
    return UNITY_END();  // End Unity Test Framework
}
