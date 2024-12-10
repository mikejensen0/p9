#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

// Structure to represent a token
typedef struct {
    char type; // '+' '-' '*' '/' '(' ')' 'n' (number)
    double value;
} Token;


// Function to tokenize the expression (simplified)
Token* tokenize(const char* expression, int* tokenCount) {
    *tokenCount = 0;
    Token* tokens = malloc(strlen(expression) * sizeof(Token)); //Over-allocate for simplicity

    for (int i = 0; expression[i] != '\0'; i++) {
        if (isdigit(expression[i]) || expression[i] == '.') {
            char numStr[20]; // Max number length (adjust if needed)
            int j = 0;
            while (isdigit(expression[i]) || expression[i] == '.') {
                numStr[j++] = expression[i++];
            }
            numStr[j] = '\0';
            tokens[*tokenCount].type = 'n';
            tokens[*tokenCount].value = atof(numStr);
            (*tokenCount)++;
            i--; // Adjust index because of inner while loop
        } else if (strchr("+-*/()", expression[i]) != NULL) {
            tokens[*tokenCount].type = expression[i];
            (*tokenCount)++;
        }
    }
    return tokens;
}

//Recursive descent parsing functions (simplified)
double parseExpression(Token* tokens, int* index);
double parseTerm(Token* tokens, int* index);
double parseFactor(Token* tokens, int* index);

double parseFactor(Token* tokens, int* index) {
    if (tokens[*index].type == '(') {
        (*index)++;
        double result = parseExpression(tokens, index);
        if (tokens[*index].type != ')') {
          fprintf(stderr, "Missing closing parenthesis\n");
          exit(1);
        }
        (*index)++;
        return result;
    } else if (tokens[*index].type == 'n') {
        double value = tokens[*index].value;
        (*index)++;
        return value;
    } else {
        fprintf(stderr, "Unexpected token in expression\n");
        exit(1);
    }
}


double parseTerm(Token* tokens, int* index) {
    double result = parseFactor(tokens, index);
    while (tokens[*index].type == '*' || tokens[*index].type == '/') {
        char op = tokens[*index].type;
        (*index)++;
        double next = parseFactor(tokens, index);
        if (op == '*') result *= next;
        else result /= next;
    }
    return result;
}

double parseExpression(Token* tokens, int* index) {
    double result = parseTerm(tokens, index);
    while (tokens[*index].type == '+' || tokens[*index].type == '-') {
        char op = tokens[*index].type;
        (*index)++;
        double next = parseTerm(tokens, index);
        if (op == '+') result += next;
        else result -= next;
    }
    return result;
}

void getExpression(char *expression, size_t size) { 
    printf("Enter an expression: ");
    fgets(expression, size, stdin);
}

int main() {
    char expression[100];
    printf("Enter an expression: ");
    fgets(expression, sizeof(expression), stdin);
    expression[strcspn(expression, "\n")] = 0; //Remove trailing newline

    int tokenCount;
    Token* tokens = tokenize(expression, &tokenCount);

    if (tokens == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return 1;
    }


    int index = 0;
    double result = parseExpression(tokens, &index);

    if (index != tokenCount) {
      fprintf(stderr, "Invalid expression\n");
    } else {
      printf("Result: %f\n", result);
    }

    free(tokens);
    return 0;
}