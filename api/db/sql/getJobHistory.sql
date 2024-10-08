WITH BackgroundJobDetailsCTE AS (
  SELECT
    *,
    SUBSTR(handler,
      INSTR(handler,
        '"name":"') + 8,
      INSTR(SUBSTR(handler,
          INSTR(handler,
            '"name":"') + 8),
        '"') - 1) AS name,
    SUBSTR(REPLACE(SUBSTR(handler,
          INSTR(handler,
            '"args":["') + 8,
          INSTR(SUBSTR(handler,
              INSTR(handler,
                '"args":["') + 8),
            '"]') - 1),
        '"',
        ''),
      1,
      INSTR(REPLACE(SUBSTR(handler,
            INSTR(handler,
              '"args":["') + 8,
            INSTR(SUBSTR(handler,
                INSTR(handler,
                  '"args":["') + 8),
              '"]') - 1),
          '"',
          ''),
        '_') - 1) AS model,
    SUBSTR(REPLACE(SUBSTR(handler,
          INSTR(handler,
            '"args":["') + 8,
          INSTR(SUBSTR(handler,
              INSTR(handler,
                '"args":["') + 8),
            '"]') - 1),
        '"',
        ''),
      INSTR(REPLACE(SUBSTR(handler,
            INSTR(handler,
              '"args":["') + 8,
            INSTR(SUBSTR(handler,
                INSTR(handler,
                  '"args":["') + 8),
              '"]') - 1),
          '"',
          ''),
        '_') + 1) AS jobPicId
  FROM
    BackgroundJob
)
SELECT
bjd.id,
  bjd.createdAt,
  bjd.updatedAt,
  bjd.name,
  bjd.jobPicId,
  bjd.attempts,
  bjd.queue,
  bjd.priority,
  bjd.runAt,
  bjd.lockedAt,
  bjd.lockedBy,
  bjd.failedAt,
  CASE
    WHEN bjd.lastError IS NOT NULL THEN
      TRIM(SUBSTR(
        REPLACE(
          REPLACE(
            REPLACE(bjd.lastError, 'Error: ', ''),
            'TypeError: ',
            ''
          ),
          'ReferenceError: ',
          ''
        ),
        1,
        INSTR(bjd.lastError || CHAR(10), CHAR(10)) - 1
      ))
    ELSE NULL
  END as lastError,
  p.id as picId,
  p.albumId,
  p.description,
  p.format,
  p.height,
  p.width,
  p.original,
  p.thumbnail,
  p.withoutBackground,
    CASE
      WHEN bjd.createdAt IS NOT NULL AND bjd.updatedAt IS NOT NULL THEN
        ROUND(
          CAST((JULIANDAY(datetime(bjd.updatedAt / 1000, 'unixepoch')) -
                JULIANDAY(datetime(bjd.createdAt / 1000, 'unixepoch'))) * 86400 AS REAL)
        )
      ELSE NULL
    END as durationSeconds,
    CASE
      WHEN bjd.failedAt IS NOT NULL OR bjd.lastError IS NOT NULL THEN 'failed'
      WHEN bjd.lockedAt IS NOT NULL THEN 'running'
      WHEN bjd.runAt IS NOT NULL THEN 'scheduled'
      ELSE 'done'
    END as status

FROM
  BackgroundJobDetailsCTE bjd
  LEFT JOIN Pic p ON (bjd.model = 'pic'
      AND p.id = 'pic_' || bjd.jobPicId)
WHERE
  (bjd.name = ? OR ? IS NULL)
  AND (status = ? OR ? IS NULL)
  AND (
    (? IS NOT NULL AND bjd.name = ?) -- Filter by name if provided
    OR (? IS NOT NULL AND status = ?) -- Filter by status if provided
    OR (? IS NULL AND ? IS NULL) -- No filters applied
  )
ORDER BY
  bjd.updatedAt DESC
LIMIT 100;
