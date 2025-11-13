#!/usr/bin/env node
/**
 * Post-build git automation script
 * Runs git status, add, commit, and push after successful build
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

function runCommand(command, description, allowFailure = false) {
  try {
    console.log(`\n📋 ${description}...`);
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    return { success: true, output };
  } catch (error) {
    if (allowFailure) {
      console.log(`⚠️  ${description} skipped (no changes or already up to date)`);
      return { success: false, output: null };
    }
    console.error(`❌ Error: ${description} failed`);
    console.error(error.message);
    process.exit(1);
  }
}

function hasChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// Get version/timestamp for commit message
function getVersionString() {
  try {
    // Try to read version from package.json
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
    if (packageJson.version) {
      return packageJson.version;
    }
  } catch (e) {
    // Fallback to timestamp if no version
  }

  // Use date/time as version identifier
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS
  return `${dateStr}.${timeStr}`;
}

console.log('\n🚀 Starting post-build git workflow...\n');

// 1. Git status
runCommand('git status', 'Checking git status');

// Check if there are any changes
if (!hasChanges()) {
  console.log('\n⚠️  No changes detected. Skipping commit and push.\n');
  process.exit(0);
}

// 2. Git add
runCommand('git add .', 'Staging all changes');

// Check again after staging (in case only untracked files were added)
if (!hasChanges()) {
  console.log('\n⚠️  No changes to commit after staging. Build completed.\n');
  process.exit(0);
}

// 3. Get version and commit
const version = getVersionString();
const commitMessage = `update ${version}`;
const commitResult = runCommand(`git commit -m "${commitMessage}"`, `Committing changes (${commitMessage})`, true);

// 4. Git push (only if commit was successful)
if (commitResult.success) {
  runCommand('git push origin main', 'Pushing to origin/main');
  console.log('\n✅ Post-build git workflow completed successfully!\n');
} else {
  console.log('\n⚠️  No changes to commit. Build completed without git operations.\n');
}

