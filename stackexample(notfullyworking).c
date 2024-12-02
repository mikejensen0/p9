#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include <stddef.h>

#define MAX_SIZE 100 // Define the maximum size of the stack
#define MAX_INPUT_LENGTH 1000
typedef struct {
    int arr[MAX_SIZE];
    int top;
} Stack;

// Initialize the stack
void initialize(Stack *s) {
    s->top = -1;
}

// Check if the stack is full
int isFull(Stack *s) {
    return s->top == MAX_SIZE - 1;
}

// Check if the stack is empty
int isEmpty(Stack *s) {
    return s->top == -1;
}

// Push an element onto the stack
void push(Stack *s, int value) {
    if (isFull(s)) {
        printf("Stack Overflow!\n");
        return;
    }
    s->arr[++s->top] = value;
}

// Pop an element from the stack
int pop(Stack *s) {
    if (isEmpty(s)) {
        printf("Stack Underflow!\n");
        return INT_MIN; //Return a special value to indicate error.
    }
    return s->arr[s->top--];
}

// Add the top two elements
void add(Stack *s) {
    if (s->top < 1) {
        printf("Not enough elements for addition!\n");
        return;
    }
    int op2 = pop(s);
    int op1 = pop(s);
    if (op1 == INT_MIN || op2 == INT_MIN) {
        printf("Error during addition operation.\n");
        return;
    }
    push(s, op1 + op2);
}

// Subtract the top two elements (top - second top)
void sub(Stack *s) {
    if (s->top < 1) {
        printf("Not enough elements for subtraction!\n");
        return;
    }
    int op2 = pop(s);
    int op1 = pop(s);
    if (op1 == INT_MIN || op2 == INT_MIN) {
        printf("Error during subtraction operation.\n");
        return;
    }

    push(s, op1 - op2);
}

void tokenizeUserInputAndExecuteCommand(char *buffer, size_t size, Stack *s) {
    printf("Enter input: ");
    fgets(buffer, size, stdin);
    char *token;

    // Remove the square brackets and quotes
    for (int i = 0; buffer[i]; i++) {
        if (buffer[i] == '[' || buffer[i] == ']' || buffer[i] == '\"') {
            buffer[i] = ' ';
        }
    }

    // Tokenize the input by commas
    token = strtok(buffer, ",");
    while (token != NULL) {
        // Trim leading and trailing spaces
        while (*token == ' ') token++;
        char *end = token + strlen(token) - 1;
        while (end > token && *end == ' ') {
            *end = '\0';
            end--;
        }

    if (strncmp(token, "push", 4) == 0) {
        // Extract the number after "push"
        int value = atoi(token + 5); // Assume valid input like "push 20"
        push(s, value);
    } else if (strcmp(token, "pop") == 0){
        pop(s);
    }else if (strcmp(token, "add") == 0) {
        add(s);
    } else if (strcmp(token, "sub") == 0) {
        sub(s);
    }else  {
        printf("Unknown command: %s\n", token);
    }
        // Move to the next command
        token = strtok(NULL, ",");
    }
}


int main() {
    Stack s;
    initialize(&s);
    char input[MAX_INPUT_LENGTH];
    char *start, *end;
    int len;


    printf("Enter commands as a JSON-like array (e.g., [\"push 20\", \"push 30\", \"add\"]): ");
    fgets(input, sizeof(input), stdin);

    input[strcspn(input, "\n")] = 0; //Remove trailing newline

    //Find the start and end of the commands within the brackets
    start = strchr(input, '[');
    if (start == NULL) {
        printf("Invalid input format\n");
        return 1;
    }
    start++; //Move past the '['

    end = strrchr(input, ']');
    if (end == NULL) {
        printf("Invalid input format\n");
        return 1;
    }
    len = end - start;


    char commands[len +1]; //allocate space for the commands. +1 for the null terminator
    strncpy(commands,start,len);
    commands[len] = '\0';


    char *token = strtok(commands, "\"");
    while (token != NULL){
        if(strlen(token) > 0){
            char *command = strtok(token, " ");
            if (strcmp(command, "push") == 0) {
                char *value_str = strtok(NULL, " ");
                if (value_str != NULL){
                    int value = atoi(value_str);
                    push(&s, value);
                } else {
                    printf("Invalid push command: missing value\n");
                }

            } else if (strcmp(command, "add") == 0) {
                add(&s);
            } else if (strcmp(command, "sub") == 0) {
                sub(&s);
            } else if (strcmp(command, "pop") == 0) {
                int popped = pop(&s);
                if (popped != INT_MIN) {
                    printf("Popped value: %d\n", popped);
                }
            } else {
                printf("Invalid command: %s\n", command);
            }
            printf("Stack after command \"%s\": ", command);
            for (int j = 0; j <= s.top; j++) {
                printf("%d ", s.arr[j]);
            }
            printf("\n");

        }
        token = strtok(NULL, "\"");
    }

    return 0;
}