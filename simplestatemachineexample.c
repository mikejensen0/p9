#include <stdio.h>
#include <string.h>

// Define the states
typedef enum {
  OPENED,
  CLOSED,
  LOCKED,
} DoorState;

DoorState currentState = CLOSED;
// Function to transition the door state
DoorState transition(const char* action) {
  switch (currentState) {
    case OPENED:
      if (strcmp(action, "CLOSE") == 0) {
        currentState = CLOSED;
        return currentState;
      } else {
        printf("Invalid action '%s' for state OPENED\n", action);
        return currentState; //Stay in the same state if invalid action
      }
    case CLOSED:
      if (strcmp(action, "LOCK") == 0) {
        currentState = LOCKED;
        return currentState;
      } else if (strcmp(action, "OPEN") == 0) {
        currentState = OPENED;
        return currentState;
      } else {
        printf("Invalid action '%s' for state CLOSED\n", action);
        return currentState;
      }
    case LOCKED:
      if (strcmp(action, "UNLOCK") == 0) {
        currentState = CLOSED;
        return currentState; //Transition to UNLOCKED state
      } else {
        printf("Invalid action '%s' for state LOCKED\n", action);
        return currentState;
      }
    default:
      printf("Unknown state!\n");
      return CLOSED; 
  }
}

// Function to print the current state of the door
void printState() {
  switch (currentState) {
    case OPENED:
      printf("Door is OPENED\n");
      break;
    case CLOSED:
      printf("Door is CLOSED\n");
      break;
    case LOCKED:
      printf("Door is LOCKED\n");
      break;
    default:
      printf("Unknown state!\n");
  }
}

 DoorState returnState()
 {
    return currentState;
 }

 void resetState(){
    currentState = CLOSED;
 }

void tokenizeUserInputAndExecuteStateChanges(char *buffer, size_t size) {
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

    if (strcmp(token, "OPEN") == 0) {
        // Extract the number after "push"
        transition("OPEN");
    } else if (strcmp(token, "CLOSE") == 0){
        transition("CLOSE");
    }else if (strcmp(token, "LOCK") == 0) {
        transition("LOCK");
    } else if (strcmp(token, "UNLOCK") == 0) {
        transition("UNLOCK");
    }else  {
        printf("Unknown command: %s\n", token);
    }
        // Move to the next command
        token = strtok(NULL, ",");
    }
}

int main() {
  DoorState current_state = CLOSED; // Initial state

  // Example usage:
  printState(current_state);
  current_state = transition(current_state, "OPEN");
  printState(current_state);
  current_state = transition(current_state, "CLOSE");
  printState(current_state);
  current_state = transition(current_state, "LOCK");
  printState(current_state);
  current_state = transition(current_state, "UNLOCK");
  printState(current_state);
  current_state = transition(current_state, "CLOSE");
  printState(current_state);
  current_state = transition(current_state, "INVALID"); //test invalid action
  printState(current_state);


  return 0;
}