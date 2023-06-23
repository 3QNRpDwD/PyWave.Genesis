import logging

class Log:
    def __init__(self):
        self.logger = logging.getLogger()

    def set_logger(self,log_file_name='server.log',log_level='INFO'):
        self.logger.setLevel(eval(f'logging.{log_level}'))
        self.formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        if not self.logger.handlers:
            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(self.formatter)
            self.logger.addHandler(stream_handler)
            file_handler = logging.FileHandler(log_file_name)
            file_handler.setFormatter(self.formatter)
            self.logger.addHandler(file_handler)

    def logging(self, msg):
        self.set_logger()
        self.logger.info(msg)