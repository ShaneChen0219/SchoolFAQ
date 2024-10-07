import pytest
from nltk.stem.porter import PorterStemmer
import numpy as np
from modelTraining.nltk_utils import tokenize, stem, bagOfWords

# Initialize the stemmer for testing purposes
stemmer = PorterStemmer()

def test_tokenize():
    sentence = "Hello, how are you?"
    expected_tokens = ['Hello', ',', 'how', 'are', 'you', '?']
    assert tokenize(sentence) == expected_tokens

def test_stem():
    word = "running"
    expected_stem = "run"
    assert stem(word) == expected_stem

def test_bagOfWords():
    tokenized_sentence = ["hello", "world"]
    all_words = ["hello", "world", "goodbye"]
    expected_bag = np.array([1.0, 1.0, 0.0], dtype=np.float32)
    result = bagOfWords(tokenized_sentence, all_words)
    assert np.array_equal(result, expected_bag)

# Test edge case for bagOfWords
def test_bagOfWords_with_empty_sentence():
    tokenized_sentence = []
    all_words = ["hello", "world", "goodbye"]
    expected_bag = np.array([0.0, 0.0, 0.0], dtype=np.float32)
    result = bagOfWords(tokenized_sentence, all_words)
    assert np.array_equal(result, expected_bag)

# Test case sensitivity for stem function
def test_stem_case_insensitivity():
    word = "RUNNING"
    expected_stem = "run"
    assert stem(word) == expected_stem
