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
  bjd.lastError,
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
                JULIANDAY(datetime(bjd.createdAt / 1000, 'unixepoch'))) * 864000 AS REAL)
        )
      ELSE NULL
    END as durationSeconds

FROM
  BackgroundJobDetailsCTE bjd
  LEFT JOIN Pic p ON (bjd.model = 'pic'
      AND p.id = 'pic_' || bjd.jobPicId)
WHERE
  bjd.name = ? OR ? IS NULL
ORDER BY
  bjd.updatedAt DESC;
