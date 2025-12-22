/**
 * Highlighted Text Component
 * Displays text with highlighted search matches
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { highlightText } from '@/shared/utils/search';

interface HighlightedTextProps {
  text: string;
  query: string;
  style?: any;
  highlightStyle?: any;
}

export default function HighlightedText({
  text,
  query,
  style,
  highlightStyle,
}: HighlightedTextProps) {
  const segments = highlightText(text, query);

  return (
    <Text style={style}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={segment.highlighted ? [styles.highlight, highlightStyle] : undefined}
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#FFF59D',
    fontWeight: '600',
  },
});
