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
  name as id,
  name,
  CAST(count(name) AS INTEGER) AS jobCount
FROM
  BackgroundJobDetailsCTE
GROUP BY
  name
ORDER BY
  name;
