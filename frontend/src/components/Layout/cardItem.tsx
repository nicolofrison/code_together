import { Card, CardContent } from '@mui/material';
import React from 'react';

const cardContentStyle: React.CSSProperties = {
  position: 'relative',
  height: 'calc(100% - 32px)',
  paddingBottom: '16px'
};

type Props = {
  children: React.ReactNode;
};

export default function CardItem({ children }: Props) {
  return (
    <Card style={{ height: '100%' }}>
      {/* The padding bottom is 24px, and the top is 16px */}
      <CardContent style={cardContentStyle}>{children}</CardContent>
    </Card>
  );
}
