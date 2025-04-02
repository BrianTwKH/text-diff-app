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

    // 將文字分行處理
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    // 儲存每行比對結果
    const processedDiff = {
      text1Diff: [],
      text2Diff: [],
    };

    // 找出最大行數以確保所有行都被處理
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = i < lines1.length ? lines1[i] : '';
      const line2 = i < lines2.length ? lines2[i] : '';

      // 如果兩行內容相同，不需要特別處理
      if (line1 === line2) {
        processedDiff.text1Diff.push({
          line: i + 1,
          content: [{ value: line1, isDiff: false }],
          hasDiff: false,
        });

        processedDiff.text2Diff.push({
          line: i + 1,
          content: [{ value: line2, isDiff: false }],
          hasDiff: false,
        });
        continue;
      }

      // 使用 diffWords 進行更精確的字詞比較
      const differences = Diff.diffWords(line1, line2);

      // 處理第一個文字的差異
      const line1Content = [];
      const line2Content = [];

      differences.forEach((part) => {
        if (part.added) {
          // 這部分在第二個文字中新增
          line2Content.push({ value: part.value, isDiff: true });
        } else if (part.removed) {
          // 這部分從第一個文字中刪除
          line1Content.push({ value: part.value, isDiff: true });
        } else {
          // 相同的部分
          line1Content.push({ value: part.value, isDiff: false });
          line2Content.push({ value: part.value, isDiff: false });
        }
      });

      processedDiff.text1Diff.push({
        line: i + 1,
        content: line1Content,
        hasDiff: line1Content.some((part) => part.isDiff),
      });

      processedDiff.text2Diff.push({
        line: i + 1,
        content: line2Content,
        hasDiff: line2Content.some((part) => part.isDiff),
      });
    }

    setDiffResult(processedDiff);
  };

  const renderDiffText = (content) => {
    return content.map((part, index) => (
      <span key={`part-${index}-${part.value.substring(0, 10)}`} className={part.isDiff ? 'text-danger fw-bold' : ''}>
        {part.value}
      </span>
    ));
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
            <div className='text-center fw-bold text-success'>完全相符</div>
          </Card.Body>
        </Card>
      )}

      {diffResult && (
        <Card className='mb-4'>
          <Card.Header>比對結果（只顯示差異部分）</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>原始文字差異</h5>
                {diffResult.text1Diff
                  .filter((line) => line.hasDiff)
                  .map((line, index) => (
                    <div key={`text1-${line.line}-${index}`} className='mb-1'>
                      <Badge bg='secondary' className='me-2'>
                        行 {line.line}
                      </Badge>
                      {renderDiffText(line.content)}
                    </div>
                  ))}
              </Col>
              <Col md={6}>
                <h5>比較文字差異</h5>
                {diffResult.text2Diff
                  .filter((line) => line.hasDiff)
                  .map((line, index) => (
                    <div key={`text2-${line.line}-${index}`} className='mb-1'>
                      <Badge bg='secondary' className='me-2'>
                        行 {line.line}
                      </Badge>
                      {renderDiffText(line.content)}
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
