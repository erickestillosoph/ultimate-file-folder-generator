# Project Title

WAZIWAP generator

## Description

Generator Files and Folders

## Installation

```bash
git clone https://github.com/erickestillosoph/ultimate-file-folder-generator.git
```

#### For Mac Users

on the `.zshrc` folder add this alias
where to open the .zshrc

```bash
open ~/.zshrc
```

```bash
alias create-component="node ~/YourDirectoryFolder/ultimate-file-folder-generator/createComponent.js"
```

then save the run:

```bash
source ~/.zshrc
```

#### For Windows add .bat file and search for where to add it on your system

Open a notepad and paste the following:

```bat
@echo off
node %USERPROFILE%\ultimate-file-folder-generator\createComponent.js %*
```

save the file name as `create-component.bat` in a folder that is added to your system's PATH (C:\Users\YourUser\scripts\).

Add this folder to the Windows PATH:

Press `Win + R`, type `sysdm.cpl`, and hit Enter.
Go to Advanced > Environment Variables.
Under System variables, find and select Path, then click Edit.
Click New, and add `C:\Users\YourUser\ultimate-file-folder-generator\`
Click OK, then restart your terminal.
open a new cmd terminal run

```bash
create-component ReplaceNameOfTheComponentHere
```

## Usage

Please check this out first what command samples to use!

```bash
create-component help
```

copy the path folder of the folder you want to execute the command:

- change directory to that folder e.g `cd project-folder/src`
  examples run:

```bash
create-component MyComponent hk2 fm3 pg2
```

```bash
create-component MyComponent hk2 fm3 pg2
```
