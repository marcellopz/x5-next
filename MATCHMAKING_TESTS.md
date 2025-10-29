# Matchmaking Algorithm Testing Environment

This testing environment provides comprehensive testing for the matchmaking algorithm with various scenarios, constraints, and edge cases.

## Files Overview

### Core Algorithm

- `lib/matchmaking-algorithm.ts` - Main matchmaking algorithm implementation
- `lib/test-data-generator.ts` - Test data generation utilities

### Test Files

- `__tests__/matchmaking-algorithm.test.ts` - Unit tests using Vitest
- `scripts/test-matchmaking-algorithm.ts` - Basic stress testing script
- `scripts/comprehensive-test-runner.ts` - Comprehensive testing suite

## Running Tests

### 1. Unit Tests (Vitest)

```bash
npm run test:matchmaking:watch
```

Runs unit tests with watch mode for development.

### 2. Basic Stress Tests

```bash
npm run test:matchmaking
```

Runs basic stress tests with random data generation.

### 3. Comprehensive Tests

```bash
npm run test:matchmaking:comprehensive
```

Runs comprehensive test suite with multiple scenarios and constraints.

## Test Scenarios

### Basic Functionality

- ✅ Random player generation
- ✅ Tolerance constraint validation
- ✅ Match count validation
- ✅ Different match generation on multiple runs

### Preset Lanes

- ✅ Full preset lane assignments
- ✅ Partial preset lane assignments
- ✅ Mixed preset and random assignments

### Avoid Roles

- ✅ Single avoid role constraint
- ✅ Multiple avoid role constraints
- ✅ Same player avoiding multiple roles

### Player Combos

- ✅ 2-player combos
- ✅ 3-player combos
- ✅ 4-player combos
- ✅ 5-player combos

### Complex Scenarios

- ✅ All constraints combined
- ✅ Impossible constraint handling
- ✅ Edge case scenarios

### Edge Cases

- ✅ Identical rank players
- ✅ Extreme rank differences
- ✅ Wildcard players
- ✅ Zero tolerance
- ✅ High tolerance values

### Performance Tests

- ✅ Execution time validation
- ✅ High match options count
- ✅ Stress testing with multiple iterations

## Test Data Types

### Player Generation

- **Random Players**: Players with random ranks (1-10)
- **Balanced Players**: Players with specific role strengths
- **Extreme Players**: Players with extreme rank differences
- **Identical Players**: Players with identical ranks
- **Wildcard Players**: Custom players with wildcard IDs

### Configuration Scenarios

- **Basic Config**: Default settings
- **Preset Lanes**: Fixed lane assignments
- **Avoid Roles**: Role restrictions
- **Player Combos**: Team grouping requirements
- **Complex Config**: Multiple constraints combined

## Algorithm Features Tested

### Core Features

- ✅ 10-player match generation
- ✅ Lane tolerance validation
- ✅ Team balance calculation
- ✅ Multiple match options

### Constraint Handling

- ✅ Preset lane assignments
- ✅ Avoid role rules
- ✅ Player combo requirements
- ✅ Constraint conflict resolution

### Edge Case Handling

- ✅ Impossible constraint scenarios
- ✅ Extreme rank differences
- ✅ Wildcard player support
- ✅ Performance optimization

## Test Results Interpretation

### Success Metrics

- **Test Success Rate**: Percentage of test scenarios that passed
- **Iteration Success Rate**: Percentage of individual test runs that passed
- **Execution Time**: Average time per match generation
- **Constraint Validation**: Whether all constraints were properly enforced

### Performance Benchmarks

- **Excellent**: < 100ms average execution time
- **Good**: 100-500ms average execution time
- **Acceptable**: 500-1000ms average execution time
- **Poor**: > 1000ms average execution time

## Adding New Tests

### 1. Add Test Scenario

```typescript
const newScenario: TestScenario = {
  name: "Your Test Name",
  players: TestDataGenerator.generateRandomPlayers(),
  config: {
    // Your configuration
  },
  expectedBehavior: {
    shouldSucceed: true,
    minMatches: 1,
    constraints: ["Your constraint description"],
  },
};
```

### 2. Add to Test Suite

Add your scenario to the `generateTestScenarios()` method in `TestDataGenerator`.

### 3. Run Tests

```bash
npm run test:matchmaking:comprehensive
```

## Debugging Failed Tests

### Common Issues

1. **Constraint Conflicts**: Check if constraints are mutually exclusive
2. **Tolerance Too Low**: Increase tolerance for extreme rank differences
3. **Performance Issues**: Reduce iterations or optimize algorithm
4. **Random Failures**: Increase iteration count for statistical significance

### Debug Mode

Add console.log statements in the algorithm to trace execution:

```typescript
console.log("Debug info:", { players, config, result });
```

## Continuous Integration

The tests are designed to run in CI environments:

- Deterministic test data generation
- Configurable iteration counts
- Performance benchmarks
- Clear pass/fail criteria

## Future Enhancements

- [ ] Add more complex constraint scenarios
- [ ] Implement algorithm performance profiling
- [ ] Add memory usage testing
- [ ] Create visual test result reporting
- [ ] Add integration tests with real player data
