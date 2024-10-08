#include "unity.h"

extern int add(int a, int b); // This will be defined by the user-supplied code

void setUp(void) {
}

void tearDown(void) {
}

void test_add_positive() {
    TEST_ASSERT_EQUAL(5, add(2, 3));
}

void test_add_negative() {
    TEST_ASSERT_EQUAL(-1, add(-2, 1));
}

int main(void) {
    UNITY_BEGIN();  // Start Unity Test Framework
    RUN_TEST(test_add_positive);
    RUN_TEST(test_add_negative);
    return UNITY_END();  // End Unity Test Framework
}
