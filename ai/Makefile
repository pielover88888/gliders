# Makefile

UNAME := $(shell uname)

ifeq ($(UNAME), Darwin)
	CC = /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++
	STD = -std=c++14 -stdlib=libc++
else
	CC = g++
	STD = -std=c++14
endif

TARGET = gliders

SRC_PATH = src
SRC_EXCLUDE_PATH = src/legacy/*
SRC_EXCLUDE_PATH_2 = 

TEST_PATH = tests

BUILD_PATH = build


#OPTIMIZATION = -O4 -ffast-math -DNDEBUG
OPTIMIZATION = -O0 -g
CFLAGS = -Wall -Wfatal-errors -Wno-missing-braces -Wno-unused $(OPTIMIZATION) $(STD) -Isrc/
LIBS_PREFIX =
LIBS_SUFFIX =

HEADERS = $(shell find $(SRC_PATH) -type f \( \( -name "*.h" -o -name "*.hpp" -o -name "*.hxx" \) ! -path "$(SRC_EXCLUDE_PATH)" ! -path "$(SRC_EXCLUDE_PATH_2)" \))
SOURCES = $(shell find $(SRC_PATH) -type f \( \( -name "*.c" -o -name "*.cpp" -o -name "*.cxx" \) ! -path "$(SRC_EXCLUDE_PATH)" ! -path "$(SRC_EXCLUDE_PATH_2)" \))
SRC_OBJECTS = $(patsubst %.cpp, $(BUILD_PATH)/%.o, $(SOURCES))

TESTS = $(shell find $(TEST_PATH) -type f \( -name "*.c" -o -name "*.cpp" -o -name "*.cxx" \))
TEST_OBJECTS = $(patsubst %.cpp, $(BUILD_PATH)/%.o, $(TESTS))

.DEFAULT_GOAL: default

.PHONY:	default all test clean

.PRECIOUS:	$(TARGET) $(BUILD_PATH)/*

.SECONDARY:	

all:	default

default:	$(TARGET)

$(BUILD_PATH)/%.o:	%.cpp $(HEADERS)
	mkdir -p "$(@D)"
	$(CC) $(CFLAGS) -c $< -o $@

$(TARGET):	$(SRC_OBJECTS)
	$(CC) $(CFLAGS) $(LIBS_PREFIX) $^ -o $@ $(LIBS_SUFFIX)

test:	$(TEST_OBJECTS) $(filter-out build/src/main.o, $(SRC_OBJECTS))
	$(CC) $(CFLAGS) $(LIBS_PREFIX) $^ -o $@ $(LIBS_SUFFIX)

clean:
	-rm -rf $(BUILD_PATH) $(TARGET)
