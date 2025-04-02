import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import './App.css';
import * as Diff from 'diff';

function App() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState(null);
  const [isMatch, setIsMatch] = useState(false);

  const compareDiff = () => {
    // 先檢查兩段文字是否完全相符
    if (text1 === text2) {
      setIsMatch(true);
      setDiffResult(null);
      return;
    }

    setIsMatch(false);

    // 使用 diff 函式庫比對每行文字
    const differences = Diff.diffLines(text1, text2);

    // 標註行數和差異
    const processedDiff = [];
    let line1Counter = 0;
    let line2Counter = 0;

    differences.forEach((part) => {
      if (part.added) {
        // 在第二段文字中添加的行
        const lines = part.value.split('\n').filter((line) => line !== '');
        lines.forEach((line) => {
          line2Counter++;
          processedDiff.push({
            type: 'added',
            line: line2Counter,
            value: line,
            source: 2,
          });
        });
        if (part.value.endsWith('\n')) line2Counter++;
      } else if (part.removed) {
        // 從第一段文字中刪除的行
        const lines = part.value.split('\n').filter((line) => line !== '');
        lines.forEach((line) => {
          line1Counter++;
          processedDiff.push({
            type: 'removed',
            line: line1Counter,
            value: line,
            source: 1,
          });
        });
        if (part.value.endsWith('\n')) line1Counter++;
      } else {
        // 相同的行，不顯示
        const lines = part.value.split('\n').filter((line) => line !== '');
        lines.forEach(() => {
          line1Counter++;
          line2Counter++;
        });
        if (part.value.endsWith('\n')) {
          line1Counter++;
          line2Counter++;
        }
      }
    });

    setDiffResult(processedDiff);
  };

  return (
    <Container className='py-4'>
      <h1 className='text-center mb-4'>炫砲文字比對工具</h1>

      <Row className='mb-4'>
        <Col md={6}>
          <Card className='h-100'>
            <Card.Body>
              <Card.Title>原始文字</Card.Title>
              <Form.Control
                as='textarea'
                rows={10}
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder='請在此貼上原始文字...'
                className='mb-2'
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className='h-100'>
            <Card.Body>
              <Card.Title>比較文字</Card.Title>
              <Form.Control
                as='textarea'
                rows={10}
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder='請在此貼上要比較的文字...'
                className='mb-2'
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className='text-center mb-4'>
        <Button variant='primary' size='lg' onClick={compareDiff} disabled={!text1 || !text2}>
          比對差異
        </Button>
      </div>

      {isMatch && (
        <Card className='mb-4'>
          <Card.Header>比對結果</Card.Header>
          <Card.Body>
            <div className='text-center fw-bold text-success'>match</div>
          </Card.Body>
        </Card>
      )}

      {diffResult && diffResult.length > 0 && (
        <Card className='mb-4'>
          <Card.Header>比對結果（只顯示差異部分）</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>原始文字差異</h5>
                {diffResult
                  .filter((part) => part.source === 1)
                  .map((part) => (
                    <div key={`removed-${part.line}-${part.value.substring(0, 10)}`} className='mb-1'>
                      <Badge bg='secondary' className='me-2'>
                        行 {part.line}
                      </Badge>
                      <span className='text-danger fw-bold text-decoration-line-through'>{part.value}</span>
                    </div>
                  ))}
              </Col>
              <Col md={6}>
                <h5>比較文字差異</h5>
                {diffResult
                  .filter((part) => part.source === 2)
                  .map((part) => (
                    <div key={`added-${part.line}-${part.value.substring(0, 10)}`} className='mb-1'>
                      <Badge bg='secondary' className='me-2'>
                        行 {part.line}
                      </Badge>
                      <span className='text-success fw-bold'>{part.value}</span>
                    </div>
                  ))}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default App;
